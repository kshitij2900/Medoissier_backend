const express = require('express') ;
const router = express.Router() ;
const user_controller = require('../controllers/user_controller') ;

router.get('/profile' , user_controller.user_profile); 

module.exports = router ;
