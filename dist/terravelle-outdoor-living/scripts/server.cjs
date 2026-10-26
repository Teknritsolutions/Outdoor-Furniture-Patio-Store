const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const root = path.resolve(__dirname, "..");
const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".json": "application/json",
    ".xml": "application/xml",
};
http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file = path.resolve(
        root,
        `.${decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname)}`,
    );
    if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(root, "pages", "404.html");
        res.statusCode = 404;
    }
    res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    const stream = fs.createReadStream(file);
    if (
        /\.(html|css|js|svg|xml|json)$/.test(file) &&
        /gzip/.test(req.headers["accept-encoding"] || "")
    ) {
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Vary", "Accept-Encoding");
        stream.pipe(zlib.createGzip()).pipe(res);
    } else {
        stream.pipe(res);
    }
}).listen(process.env.PORT || 4173, "127.0.0.1", () =>
    console.log("Terravelle: http://localhost:4173"),
);
