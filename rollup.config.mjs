import fs from 'fs';
import http from 'http';
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
      if (compiled.loadedUrls) {
        for (const url of compiled.loadedUrls) {
          if (url.protocol === 'file:') {
            this.addWatchFile(fileURLToPath(url));
          }
        }
      }
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
  buildStart() {
    this.addWatchFile(path.resolve(__dirname, 'src/demo/index.html'));
    this.addWatchFile(path.resolve(__dirname, 'src/demo/favicon.svg'));
  },
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

let serverInstance = null;

const devServerPlugin = {
  name: 'dev-server',
  writeBundle() {
    if (serverInstance || !process.env.ROLLUP_WATCH) {
      return;
    }

    const distDemo = path.resolve(__dirname, 'dist/demo');
    const mimeTypes = {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json',
      '.map': 'application/json',
      '.mjs': 'application/javascript; charset=utf-8',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
    };

    serverInstance = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url?.split('?')[0] || '/');
      if (reqPath === '/' || reqPath.endsWith('/')) {
        reqPath += 'index.html';
      }
      const filePath = path.join(distDemo, reqPath);
      if (!filePath.startsWith(distDemo)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('Not Found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': contentType,
        });
        res.end(data);
      });
    });

    const initialPort = parseInt(process.env.PORT || '3000', 10);
    const startListening = (port) => {
      const onListening = () => {
        serverInstance.off('error', onError);
        console.log(`\nDemo server running at http://localhost:${port}/\n`);
      };
      const onError = (err) => {
        serverInstance.off('listening', onListening);
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is in use, trying ${port + 1}...`);
          startListening(port + 1);
        } else {
          console.error('Dev server error:', err);
        }
      };
      serverInstance.once('listening', onListening);
      serverInstance.once('error', onError);
      serverInstance.listen(port);
    };

    startListening(initialPort);
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
      devServerPlugin,
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
