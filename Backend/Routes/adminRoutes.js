const {addAdmin,adminLogin} = require('../Controllers/adminControllers');
const express=require('express');
const router=express.Router();
router.post('/addAdmin',addAdmin);
router.post('/auth',adminLogin);
module.exports=router;