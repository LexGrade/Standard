import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

// Dev-only static file server for the built `dist/` — used by the pa11y AAA
// audit (and handy for eyeballing the site locally). NOT shipped: the production
// surface is plain HTML on a static host (Cloudflare Pages); this just serves it
// over http so pa11y can walk real URLs with working root-relative links.
const DIST = fileURLToPath(new URL('./dist/', import.meta.url))
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
}

const server = createServer(async (req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)

    // Route → file: a directory (or extensionless route like /standard) maps to
    // its index.html, mirroring how a static host resolves it.
    if (pathname.endsWith('/')) pathname += 'index.html'
    else if (extname(pathname) === '') pathname += '/index.html'

    // Resolve safely inside dist/ — reject any traversal that escapes the root.
    const filePath = normalize(join(DIST, pathname))
    if (!filePath.startsWith(DIST)) {
        res.writeHead(403).end('Forbidden')
        return
    }

    try {
        const body = await readFile(filePath)
        res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream' }).end(body)
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found')
    }
})

server.listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}`))
