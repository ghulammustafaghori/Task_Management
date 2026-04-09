const userModel= require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtpEmail = require('../utility/mailer');


const generateOtp=()=>{
    return Math.floor(100000 + Math.random() * 90000).toString(); //6 digit
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
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 5 minutes
            
        });
        console.log("OTP:", otp);

        sendOtpEmail(email, otp).catch(err => console.error('Email error:', err));
       res.status(201).json({
            success: true,
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

        if(user.otpExpiresAt<new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP expired"
            })
        }
        
        if(user.otp.toString() !== otp.toString()){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        if (user.otp.toString().trim() !== otp.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP, please try again"
            });
        } 
        
        user.isVerified=true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        res.status(200).json({
            success:true,
            message:"User verified successfully"
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
        
    }
}

const userList= async(req,res)=>{
    const users= await userModel.find();
    res.status(200).json({
        message:"User List",
        data:users
    })
}

const updateUser = async (req, res) => {
    try {
        const { username, email, password, isVerified } = req.body;
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = username;
        user.email = email;
        user.isVerified = isVerified;

        // Only update password if a new one is provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save(); // was missing await
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id); // replaces deprecated user.remove()
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const userLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }
         // compare hashed password
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({
                        message: "Invalid Credentials"
                    });
                }
                //creating jwt token
                const token = jwt.sign({ id: user._id, email: user.email, role: user.role}, process.env.SECRET_KEY, {
                    expiresIn: '7d'
                });

                res.status(200).json({
                    message:"Login Successfull",
                    data:user,
                    token
                })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getSingleUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const veryfyToken=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports={
    addUser,
    verifyOtp,
    userList,
    updateUser,
    deleteUser,
    userLogin,
    getSingleUser,
    veryfyToken
}