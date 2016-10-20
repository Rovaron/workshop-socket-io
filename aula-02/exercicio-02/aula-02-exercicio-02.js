const http = require('http')
const fs = require('fs')
const index = fs.readFileSync('05-users.html');

const app = http.createServer((req, res)  => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(8080)

const io = require('socket.io').listen(app)
const users = []
const rooms = ['chat da uol']

io.on('connection', (socket) => {
  console.log('conexão com o Socket.io')

  socket.on('disconnect', () => {
    console.log('disconnect no socket')
  })

  socket.on('createRoom', (room) => {
    socket.room = room
    rooms.push(room)
    socket.join(room)
    socket.emit('updateRoomList', rooms)
  })

  socket.on('adduser', (user) => {
    console.log('novo usuario:', user)
    users.push(user)
    socket.join(rooms[0])
    socket.room = rooms[0]
    socket.broadcast.to(rooms[0]).emit('enterRoom', user)
    socket.user = user
    socket.broadcast.to(rooms[0]).emit('updateUsers', users)
  })

  socket.on('newMessage', (msg) => {
    senderUser = socket.user
    console.log('message:', msg)
    socket.broadcast.emit('deliverMessage', msg)
  })

  socket.on('leavechat', (user) => {
    socket.leave(rooms[0])
    socket.emit('updatelist', user);
  })

  socket.on('connect-client', (data) => {
    const d1 = new Date(data)
    console.log('connect do client em', d1.toGMTString())
  })
})

// Entre em localhost:8080