const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // only these values allowed
        default: 'user'
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    otp:{
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },

},{timestamps:true});

const userModel= mongoose.model('user', userSchema);

module.exports=userModel;