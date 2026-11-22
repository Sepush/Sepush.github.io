const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatMonthDay(value: string): string {
  const parts = monthDayFormatter.formatToParts(new Date(value));
  const month = parts.find(part => part.type === 'month')?.value ?? '01';
  const day = parts.find(part => part.type === 'day')?.value ?? '01';
  return `${month}-${day}`;
}

export function formatTime(value: string): string {
  return timeFormatter.format(new Date(value));
}

export function getYear(value: string): number {
  return new Date(value).getUTCFullYear();
}
