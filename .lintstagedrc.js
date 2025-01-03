// https://nextjs.org/docs/basic-features/eslint#lint-staged
// @ts-check
import Path from "node:path";

const buildEslintCommand = (filenames) => {
  return `biome lint --fix --unsafe ${filenames.map((f) => Path.relative(process.cwd(), f)).join(" ")}`;
};

export default {
  "*.{js,mjs,jsx,ts,tsx}": [buildEslintCommand],
  "*.*": "biome format --write",
};
