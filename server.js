const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Admin'
// Run when client connects
io.on('connection', socket => {
    // Connect user to room
    socket.on('joinRoom', ({ username, room }) => {
        // Join user to room
        const user = userJoin(socket.id, username, room); 
        socket.join(user.room)

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChartCord!'));
        
        // Broadcast when a user connects    
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`))
        
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Emit message to user
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.emit('message', formatMessage(botName, `${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))