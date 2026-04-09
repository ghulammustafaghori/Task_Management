const express = require('express');
const {Server}=require('socket.io');
const {createServer}=require('node:http');
const cors = require('cors');
const dotenv=require('dotenv');
dotenv.config(); 
const connectDB=require('./config/db');
const adminRoutes=require('./Routes/adminRoutes');
const userRoutes=require('./Routes/userRoutes');
const taskRoutes=require('./Routes/taskRoutes');

const app=express();
const server = createServer(app);


// create a new socket.io server
const io = new Server(server, {
  cors: {
    origin: '*', // your frontend
    methods: ['GET', 'POST'],
    credentials: true
  }
}); 

app.use(cors());  // to allow cross-origin requests

app.use(express.json());  // to parse JSON data


io.on('connection',(socket)=>{
console.log('new client connected',socket.id);
socket.on('disconnect',()=>{
    console.log('client disconnected',socket.id);
})
})

app.use('/api',adminRoutes);         // to use adminRoutes
app.use('/api/users',userRoutes);    // to use userRoutes
app.use('/api/tasks',taskRoutes);    // to use taskRoutes


app.set('io',io);       // to set the socket.io instance

const PORT = process.env.PORT || 5000;

// start the server
const startServer=async()=>{
    try{
        await connectDB();
        
        app.get('/',(req,res)=>{
            res.send('Hello World');
        });
         server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    }catch(err){
        console.log(err);
    }
}
startServer();