import path from 'path';
import {fileURLToPath} from 'url';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localPkgsResolver = {
  name: 'resolve-local-pkgs',
  resolveId(source) {
    if (source.startsWith('gs-tools/export/')) {
      const subpath = source.replace('gs-tools/export/', '');
      return path.resolve(
        __dirname,
        'node_modules/gs-tools/export',
        `${subpath}.ts`,
      );
    }
    return null;
  },
};

const litCssPlugin = {
  name: 'lit-css',
  transform(code, id) {
    if (id.endsWith('.scss')) {
      const compiled = sass.compileString(code, {
        loadPaths: [path.resolve(__dirname, 'node_modules')],
        url: new URL(`file://${id}`),
      });
      const escaped = compiled.css
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');
      return {
        code: `import {css} from 'lit';\nexport default css\`${escaped}\`;`,
        map: {mappings: ''},
      };
    }
    if (id.endsWith('.css')) {
      const escaped = code
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');
      return {
        code: `import {css} from 'lit';\nexport default css\`${escaped}\`;`,
        map: {mappings: ''},
      };
    }
    return null;
  },
};

export default [
  {
    input: 'src/demo/main.ts',
    output: [
      {
        file: 'dist/demo/bundle.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      localPkgsResolver,
      litCssPlugin,
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.css', '.scss'],
      }),
      commonjs(),
      typescript({
        exclude: ['**/*.test.ts'],
        include: ['src/**/*.ts', 'src/**/*.d.ts'],
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
