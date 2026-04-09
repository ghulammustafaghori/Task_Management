const express=require('express')
const {addUser,verifyOtp,userList,updateUser,deleteUser,userLogin,getSingleUser,veryfyToken}=require('../Controllers/userController');
const router=express.Router();

router.post('/addUser',addUser);  // Add user
router.post('/verifyOtp',verifyOtp); // Verify otp
router.get('/userList',userList);   // User list
router.put('/updateUser/:id',updateUser);  // Update user
router.delete('/deleteUser/:id',deleteUser);  // Delete user
router.post('/userLogin',userLogin);  // User login
router.get('/getSingleUser/:id',getSingleUser);  // Get single user

module.exports=router;