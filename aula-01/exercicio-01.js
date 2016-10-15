const http = require('http')
const fs = require('fs')

var html = fs.readFileSync('client.html')

const app = http.createServer((req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	})
	res.end(html)
}).listen(8080)

const io = require('socket.io').listen(app)

io.on('connection', (socket) => {
	console.log('connection no Socket.io', socket.handshake)

	socket.on('disconnect', () => {
		console.log('disconnect no socket', socket.handshake)
	})

	socket.on('connect-client', (data) => {
		const d1 = new Date(data)
		console.log('connect do client em', d1.toGMTString())

		setInterval(function() {
			socket.emit('hello', 'Tá acordado?!')
		}, 5000)
	})
})
