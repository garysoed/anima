import fs from 'fs';
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const gsToolsPkgDir = path.dirname(require.resolve('gs-tools/package.json'));

const localPkgsResolver = {
  name: 'resolve-local-pkgs',
  resolveId(source) {
    if (source.startsWith('gs-tools/export/')) {
      const subpath = source.replace('gs-tools/export/', '');
      return path.resolve(gsToolsPkgDir, 'export', `${subpath}.ts`);
    }
    return null;
  },
};

const svgStringPlugin = {
  name: 'svg-string',
  transform(code, id) {
    if (id.endsWith('.svg')) {
      return {
        code: `export default ${JSON.stringify(code)};`,
        map: {mappings: ''},
      };
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

const copyStaticAssetsPlugin = {
  name: 'copy-static-assets',
  writeBundle() {
    const distDemo = path.resolve(__dirname, 'dist/demo');
    fs.mkdirSync(distDemo, {recursive: true});
    fs.copyFileSync(
      path.resolve(__dirname, 'src/demo/index.html'),
      path.resolve(distDemo, 'index.html'),
    );
    fs.copyFileSync(
      path.resolve(__dirname, 'src/demo/favicon.svg'),
      path.resolve(distDemo, 'favicon.svg'),
    );
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
      svgStringPlugin,
      litCssPlugin,
      copyStaticAssetsPlugin,
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.css', '.scss'],
      }),
      commonjs(),
      typescript({
        exclude: ['**/*.test.ts'],
        include: ['src/**/*.ts', 'src/**/*.d.ts', `${gsToolsPkgDir}/**/*.ts`],
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
