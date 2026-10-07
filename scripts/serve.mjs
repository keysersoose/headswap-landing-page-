import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (url.pathname === "/demo") {
    response.writeHead(308, { Location: "/#demo" });
    response.end();
    return;
  }

  if (url.pathname === "/company") {
    response.writeHead(308, { Location: "/about" });
    response.end();
    return;
  }

  // Mirror Vercel cleanUrls: /about serves about/index.html.
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  let candidate = normalize(join(root, requested));
  if (existsSync(candidate) && statSync(candidate).isDirectory()) candidate = join(candidate, "index.html");
  else if (!existsSync(candidate) && existsSync(`${candidate}.html`)) candidate = `${candidate}.html`;
  if (!candidate.startsWith(root) || !existsSync(candidate) || !statSync(candidate).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": types[extname(candidate)] || "application/octet-stream",
    "Cache-Control": extname(candidate) === ".html" ? "no-cache" : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(candidate).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Headloom preview: http://127.0.0.1:${port}`);
});
