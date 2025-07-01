const express = require('express');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const auth = require('./routes/auth');
const chat = require('./routes/chat');
const message = require('./routes/messages');
const user = require('./routes/user'); 
const cors = require('cors');
const connectDB = require('./config/db');
const {protect} = require('./middleware/authmiddleware');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

connectDB();
const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app);   
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

io.on("connection",(socket)=>{
  console.log("New socket connection:",socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id); // each user joins their own room
    console.log("User joined personal room:", userData._id);
  });

  socket.on("join chat",(chatId)=>{
    socket.join(chatId);
    console.log("User joined chat:",chatId);
  });

  socket.on("new message",(message)=>{
    const chat = message.chat;
    if(!chat?.users) return;

    chat.users.forEach((user)=>{
      if (user._id == message.sender._id) return;
      socket.to(user._id).emit("message received",message);
    });

  socket.on("disconnect",()=>{
      console.log("User disconnected:",socket.id);
    });
  });
});

app.use('/api/auth', auth);
app.use('/api/chat',protect,chat);
app.use('/api/message',message);
app.use('/api/user', protect, user);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
