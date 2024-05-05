const express=require('express');
const router= express.Router();
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {patientlogin,patientsignup, patientdetails } = require("../controllers/PatientAuth")
var fetchuser=require('../middleware/fetchuser');
const Patient = require('../models/PatientProfile');
let success= true;

//==========================================================================//
//      ROUTE 1: create user using: POST "/api/auth/patientsignup"             //
//==========================================================================//

router.post('/patientsignup',[
    body('email').trim().isEmail(),
    body('password').isLength({ min: 5 }),
    ],patientsignup)

//======================================================================================//
//    RROUTE 2: authenticate a user using: POST "/api/auth/patientlogin" No login required.    //
//======================================================================================//
router.post('/patientlogin',[
    body('email','enter valid email').trim().isEmail(),
        body('password','password cannot be blank').exists(),
    ],patientlogin)
    
    //===================================================================================================//
    //       ROUTE 3:  Get details of a user using: POST "/api/auth/patientdashboard" login required.             //
    //===================================================================================================//
    
    router.post('/patientdetails',patientdetails)
    module.exports=router
