import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
    {
        ignores: ['**/package-lock.json', '**/dist/**', '**/node_modules/**'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
    },
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx,mts,cts}'],
    })),
    {
        files: ['**/*.{jsx,tsx}'],
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...pluginReact.configs.flat.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/jsx-no-target-blank': 'off',
            'react/jsx-no-comment-textnodes': 'off',
            'react/jsx-no-duplicate-props': 'off',
            'react/jsx-no-useless-fragment': 'off',
            'react/jsx-no-undef': 'off',
        },
    },
    {
        files: ['**/*.json'],
        ignores: ['**/tsconfig*.json'],
        plugins: { json },
        language: 'json/json',
        extends: ['json/recommended'],
    },
    prettierConfig,
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        plugins: { prettier: prettierPlugin },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            'prettier/prettier': 'error',
        },
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': 'error',
        },
    },
]);
