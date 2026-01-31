import eslint from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": "off"
		},
	},
	globalIgnores([
            'node_modules/**',
            'client/node_modules/**',
            'client/out/**',
            'server/node_modules/**',
            'server/out/**',
            'server/src/proverif/parser/**'
        ]
	),
]);