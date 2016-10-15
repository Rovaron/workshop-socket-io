const http = require('http')

const fs = require('fs')
const index = fs.readFileSync('./index.html');

const app = http.createServer((req, res)  => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(8080)

const io = require('socket.io').listen(app)

const usersList = []

io.on('connection', (socket) => {
  console.log('conexão com o Socket.io')

  socket.on('disconnect', () => {
    console.log('disconnect no socket')
  })

  socket.on('adduser', (user) => {
    console.log('user', user)
    usersList.push(user)
    socket.join('chat da uol')
    socket.broadcast.emit('enterroom', user)
    io.sockets.emit('usersListUpdate', usersList);
    socket.user = user;
  })

  socket.on('message', (msg) => {
    console.log('message', msg)
    socket.broadcast.emit('message', msg)
  })

  socket.on('connect-client', (data) => {
    const d1 = new Date(data)
    console.log('connect do client em', d1.toGMTString())
  })
})

// Entre em localhost:8080