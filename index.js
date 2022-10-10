const express = require('express');
const path = require('path');
const err404 = require('./middleware/err-404');
const userRouter = require('./routes/userRouter');
const bookRouter = require('./routes/bookRouter');
const mainRouter = require('./routes/index');
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require('socket.io');


const app = express();
const server = http.Server(app);
const io = socketIO(server);
//const httpServer = createServer(app);

//app.use(express.urlencoded());
//app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', mainRouter)
app.use('/api/user', userRouter)
app.use('/api/books', bookRouter)
const UrlDB = process.env.UrlDB
//app.use('/public', express.static(__dirname+"/public"))
app.use(err404)


io.on('connection', (socket) => {
    console.log('================================')
    const {id} = socket;
    console.log(`Socket connected: ${id}`);

    // сообщение для всех
    socket.on('message-to-all', (msg) => {
        msg.type = 'all';
        socket.broadcast.emit('message-to-all', msg);
        socket.emit('message-to-all', msg);
    });

    // сообщение себе
    socket.on('message-to-me', (msg) => {
        msg.type = 'me';
        socket.emit('message-to-me', msg);
    });

    // работа с комнатами
    const {roomName} = socket.handshake.query;
    console.log(socket.handshake.query)
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});

async function start(PORT, UrlDB) {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/');
        server.listen(PORT, () => console.log(`listening on port ${PORT}`));

    } catch (e) {
        console.log(e)
    }
}


const PORT = process.env.PORT || 3001
start(PORT, UrlDB);
