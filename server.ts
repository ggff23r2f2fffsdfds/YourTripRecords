// @ts-check

const fs = require('fs');
const path = require('path');
const express = require('express');

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
async function createServer(
  root = __dirname,
  isProd = process.env.NODE_ENV === 'production',
) {
  const resolve = (p: string) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve('client/index.html'), 'utf-8')
    : '';
  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite: any;
  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: 'ssr',
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(require('compression')());
    app.use(
      require('serve-static')(resolve('client'), {
        index: false,
      }),
    );
  }

  app.get('*', async (req: any, res: any) => {
    try {
      const url = req.originalUrl;

      let template, render;
      if (!isProd) {
        // always read fresh template in dev

        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('src/entry-server.tsx')).render;
      } else {
        template = indexProd;
        render = require('./server/entry-server.js').render;
      }

      const { appHtml, styleTags } = await render(url);
      const html = template
        .replace('<!--ssr-outlet-->', appHtml)
        .replace('<!--style-->', styleTags);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

const PORT = process.env.PORT || 3000;

createServer().then(({ app }) =>
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  }),
);

// for test use
// exports.createServer = createServer;
