const express = require('express');
const dotenv=require('dotenv');
dotenv.config(); // ✅ load env first
const connectDB=require('./config/db');
const adminRoutes=require('./Routes/adminRoutes');
const userRoutes=require('./Routes/userRoutes');

const app=express();

app.use(express.json());

app.use('/admin',adminRoutes);
app.use('/user',userRoutes);

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