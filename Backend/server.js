const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv');
dotenv.config(); 
const connectDB=require('./config/db');
const adminRoutes=require('./Routes/adminRoutes');
const userRoutes=require('./Routes/userRoutes');
const taskRoutes=require('./Routes/taskRoutes');

const app=express();

app.use(cors());

app.use(express.json());

app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use('/task',taskRoutes);

const startServer=async()=>{
    try{
        await connectDB();
        
        app.get('/',(req,res)=>{
            res.send('Hello World');
        });
         app.listen(5000, () => {
            console.log('Server started on port 5000');
        });
    }catch(err){
        console.log(err);
    }
}
startServer();