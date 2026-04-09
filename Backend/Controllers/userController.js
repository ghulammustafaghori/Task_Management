const userModel= require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateOtp=()=>{
    return Math.floor(10000 + Math.random() * 90000).toString(); //6 digit
}

const addUser=  async (req,res)=>{
    const {username,email,password}=req.body;

    try{
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp=generateOtp();

        const user=await userModel.create({
            username,
            email,
            password:hashedPassword,
            otp,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
            
        });
        console.log("OTP:", otp);
       res.status(201).json({
            message: "User registered. Please verify OTP sent to email."
        });

    }catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const verifyOtp=async(req,res)=>{
    const {email,otp}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        if(user.otp!==otp){
            return res.status(400).json({
                message:"Invalid OTP"
            })
        }
        if(user.otpExpiresAt<new Date()){
            return res.status(400).json({
                message:"OTP expired"
            })
        }
        user.isVerified=true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        res.status(200).json({
            message:"User verified successfully"
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
        if (err.code === 11000) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
    }
}

const userList= async(req,res)=>{
    const users= await userModel.find();
    res.status(200).json({
        message:"User List",
        data:users
    })
}

const updateUser=async(req,res)=>{
    const id=req.params.id;
    const {username,email,password,isVerified}=req.body;
    const user= await userModel.findById(id);
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    user.username=username;
    user.email=email;
    user.password=password;
    user.isVerified=isVerified;
    user.save();
    res.status(200).json({
        message:"User updated successfully"
    })
}

const deleteUser=async(req,res)=>{
    const id=req.params.id;
    const user=await userModel.findById(id);
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    user.remove();
    res.status(200).json({
        message:"User deleted successfully"
    })
}

module.exports={
    addUser,
    verifyOtp,
    userList,
    updateUser,
    deleteUser
}