const http = require('http')
const url = require('url')
const fs = require('fs')

// WebSocket for auto reloding
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3001 })
wss.on('connection', (ws) => {
  console.log('Client connected')
  setInterval(() => {
    ws.send(`time: ${String(new Date())}`)
  }, 1000)

  // Send a message to the client whenever a file in the directory changes
  fs.watch('./', { recursive: true }, (eventType, filename) => {
    ws.send(`${filename} changed`)
  })
})

const server = http.createServer((req, res) => {
  const route = url.parse(req.url, true).pathname
  let f = routes[route]
  if (f) return f(req, res)
  res.writeHead(404, { 'Content-Type': 'text/html' })
  res.end('<h1>Page Not Found</h1>')
})
server.listen(3000, () => { console.log('Server is running on port 3000') })

const routes = {
  '/': (req, res) =>
    serveFile(res, 'source/index.html', 'text/html'),

  '/css': (req, res) =>
    serveFile(res, 'source/style.css', 'text/css'),

  '/main.js': (req, res) =>
    serveFile(res, 'source/main.js', 'text/javascript'),

  '/query': (req, res) => {
    const responses = ['No', 'Maybe', 'Probable', 'Yes']
    const randomResponse =
      res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      response: responses[Math.floor(Math.random() * responses.length)]
    }))
  },
}

function serveFile(res, fileName, type) {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.end('<h1>Internal Server Error</h1>' + err)
    } else {
      res.writeHead(200, { 'Content-Type': type })
      res.end(data)
    }
  })
}