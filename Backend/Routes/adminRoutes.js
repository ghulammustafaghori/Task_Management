const {addAdmin,adminLogin} = require('../Controllers/adminControllers');
const express=require('express');
const router=express.Router();
router.post('/addAdmin',addAdmin);
router.post('/adminLogin',adminLogin);
module.exports=router;