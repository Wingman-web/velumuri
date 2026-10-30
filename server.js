// Production entry for hosts that run a plain Node.js file instead of
// detecting Next.js (e.g. Hostinger "Other" app type: build script `build`,
// entry file `server.js`). Same as `next start`, on the port the host gives.
const http = require('node:http');
const next = require('next');

const port = Number(process.env.PORT) || 3000;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Achyutha ready on port ${port}`);
  });
});
