import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const internalGroup = (name) => [
  { pattern: `@/**/${name}/**`, group: 'internal', position: 'before' },
  { pattern: `../**/${name}/**`, group: 'parent', position: 'before' },
  { pattern: `./**/${name}/**`, group: 'sibling', position: 'before' },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  importXFlatConfigs.recommended,
  importXFlatConfigs.typescript,
  eslintPluginPrettierRecommended,
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
        }),
      ],
    },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            ...internalGroup('hooks'),
            // A hook importing a sibling hook (e.g. `./useInput` from inside
            // app/hooks/) has no "/hooks/" segment in the specifier itself.
            { pattern: './use*', group: 'sibling', position: 'before' },
            ...internalGroup('components'),
            // A component importing a sibling component (e.g.
            // `../TrackItem/TrackItem` from inside app/components/TrackList/,
            // or `./AppBar` from inside app/components/Navbar/) has no
            // "/components/" segment in the specifier itself. Component
            // folders/files are the only PascalCase paths under app/.
            { pattern: '../[A-Z]*/**', group: 'parent', position: 'before' },
            { pattern: './[A-Z]*', group: 'sibling', position: 'before' },
            ...internalGroup('utils'),
            ...internalGroup('lib'),
            ...internalGroup('constants'),
            ...internalGroup('types'),
            ...internalGroup('styles'),
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external'],
          distinctGroup: false,
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
