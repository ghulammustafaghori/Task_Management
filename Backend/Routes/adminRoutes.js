const {addAdmin,adminLogin} = require('../Controllers/adminControllers');
const express=require('express');
const router=express.Router();
router.post('/addAdmin',addAdmin);  // Add admin data
router.post('/auth',adminLogin);   // Admin login
module.exports=router;