import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  unocss: true,
  astro: true,
  vue: true,
  react: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  js: true,
});
