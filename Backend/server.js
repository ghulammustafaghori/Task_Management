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
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your frontend
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());

app.use(express.json());


io.on('connection',(socket)=>{
console.log('new client connected',socket.id);
socket.on('disconnect',(socket)=>{
    console.log('client disconnected',socket.id);
})
})

app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use('/task',taskRoutes);


app.set('io',io);

const startServer=async()=>{
    try{
        await connectDB();
        
        app.get('/',(req,res)=>{
            res.send('Hello World');
        });
         server.listen(5000, () => {
            console.log('Server started on port 5000');
        });
    }catch(err){
        console.log(err);
    }
}
startServer();