const express=require('express');
const router= express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Doctor = require('../models/DoctorProfile');
const fetchuser = require('../middleware/fetchuser');
const { doctorsignup,doctorlogin, doctordetails } = require('../controllers/DoctorAuth');
let success= true;


//==========================================================================//
//      ROUTE 1: create doctor using: POST "/api/auth/createdoctor"             //
//==========================================================================//

router.post('/doctorsignup',[
    body('email').trim().isEmail(),
    body('password').isLength({ min: 5 }),
    ],doctorsignup)

//======================================================================================//
//    RROUTE 2: authenticate a doctor using: POST "/api/auth/doctorlogin" No login required.    //
//======================================================================================//
router.post('/doctorlogin',[
    body('email','enter valid email').isEmail(),
        body('password','password cannot be blank').exists(),
    ],doctorlogin)

    //===================================================================================================//
    //       ROUTE 3:  Get details of a user using: POST "/api/auth/patientdashboard" login required.             //
    //===================================================================================================//
    
    router.post('/doctordetails',doctordetails)


    module.exports=router
