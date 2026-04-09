const mongoose=require('mongoose');


//admin schema
const adminSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // only these values allowed
        default: 'user'
    }
})


//admin model
const adminModel= mongoose.model('admin', adminSchema);

module.exports=adminModel;