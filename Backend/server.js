const express = require('express');
const dotenv=require('dotenv');
dotenv.config(); // ✅ load env first
const connectDB=require('./config/db');

const app=express();

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