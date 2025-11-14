import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: { globals: globals.node },
    },
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
]);
