import { useEffect, useRef } from 'react';

type Task = { x: number; y: number; theta: number; len: number; depth: number };

export function LivingTree() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let tasks: Task[] = [];
    let frameId = 0;
    let stopped = false;
    let tick = 0;
    const styles = getComputedStyle(document.documentElement);
    const stroke = styles.getPropertyValue('--living-tree-stroke').trim() || 'rgba(17, 24, 39, 0.08)';
    const leaf = styles.getPropertyValue('--living-tree-leaf').trim() || 'rgba(86, 121, 74, 0.16)';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seed = (x: number, y: number, theta: number, len: number) => tasks.push({ x, y, theta, len, depth: 0 });
    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = Number(styles.getPropertyValue('--living-tree-line-width')) || 1;
      context.strokeStyle = stroke;
      tasks = [];
      const count = width < 768 ? 1 : 3;
      for (let index = 0; index < count; index += 1) {
        seed(
          width * (0.15 + 0.7 * Math.random()),
          height + 40,
          -Math.PI / 2 + (Math.random() - 0.5) * 0.35,
          8 + Math.random() * 6,
        );
      }
      seed(-30, height * 0.45, -Math.PI / 5, 10);
      seed(width + 30, height * 0.5, Math.PI + Math.PI / 5, 10);
    };

    const step = (task: Task) => {
      if (task.depth >= 120 || task.len < 0.6) return;
      const x = task.x + Math.cos(task.theta) * task.len;
      const y = task.y + Math.sin(task.theta) * task.len;
      context.beginPath();
      context.moveTo(task.x, task.y);
      context.lineTo(x, y);
      context.stroke();
      if (task.depth > 72 && Math.random() < 0.12) {
        context.beginPath();
        context.fillStyle = leaf;
        context.arc(x, y, 1 + Math.random() * 1.4, 0, Math.PI * 2);
        context.fill();
      }
      seed(x, y, task.theta + (Math.random() - 0.5) * 0.15, task.len * 0.98);
      tasks[tasks.length - 1]!.depth = task.depth + 1;
      if (Math.random() < 0.025) {
        seed(x, y, task.theta + (Math.random() < 0.5 ? -1 : 1) * 0.5, task.len * 0.8);
        tasks[tasks.length - 1]!.depth = task.depth + 1;
      }
    };

    const advance = (frames: number) => {
      for (let index = 0; index < frames && tasks.length > 0; index += 1) {
        for (let count = 0; count < 40; count += 1) {
          const task = tasks.shift();
          if (!task) break;
          step(task);
        }
      }
    };
    const frame = () => {
      if (stopped) return;
      tick += 1;
      if (tick % 2 === 0) advance(1);
      frameId = requestAnimationFrame(frame);
    };
    const start = () => {
      stopped = false;
      cancelAnimationFrame(frameId);
      if (reduced) advance(220);
      else frameId = requestAnimationFrame(frame);
    };
    const restart = () => {
      resize();
      start();
    };
    const visibility = () => {
      stopped = document.visibilityState === 'hidden';
      if (!stopped) start();
    };
    restart();
    window.addEventListener('resize', restart, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', restart);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return (
    <div id='living-tree-bg' aria-hidden='true'>
      <canvas ref={ref} id='living-tree-canvas' />
    </div>
  );
}
