import { relative } from 'path';

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => relative(process.cwd(), f)).join(' --file ')}`;

export default {
  // Handle JavaScript/TypeScript files
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'],

  // Handle other file types
  '*.{json,css,scss,md,yml,yaml}': ['prettier --write'],
};
