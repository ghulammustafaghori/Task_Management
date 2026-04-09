const express=require('express')
const {addUser,verifyOtp,userList,updateUser,deleteUser,userLogin}=require('../Controllers/userController');
const router=express.Router();

router.post('/addUser',addUser);
router.post('/verifyOtp',verifyOtp);
router.get('/userList',userList);
router.put('/updateUser/:id',updateUser);
router.delete('/deleteUser/:id',deleteUser);
router.post('/userLogin',userLogin);

module.exports=router;