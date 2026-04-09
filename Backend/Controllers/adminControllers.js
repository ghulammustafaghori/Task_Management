const adminModel= require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



//admin login function
const adminLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const admin=await adminModel.findOne({email});
        if (!admin) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }
        //creating jwt token
        const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role}, process.env.SECRET_KEY,{
            expiresIn: '7d'
        });

        res.status(200).json({
            message:"Login Successfull",
            data:admin,
            token
        })
    }
    catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


//verify token
const verifyToken=(req,res,next)=>{
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
        const decoded = jwt.verify(token, SECRET_KEY);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
}


//add admin
const addAdmin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user=await adminModel.create({
            email,
            password:hashedPassword,
            role: 'admin'
        });
        res.status(200).json({
            message:"Admin Added Successfully",
            data:user
        })
    }
    catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

module.exports={
    adminLogin, addAdmin, verifyToken
}
