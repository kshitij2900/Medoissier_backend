const Patient = require("../models/PatientProfile");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const PatientSchema=require('../models/PatientProfile')
// const mailSender = require("../utils/mailSender");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();
const JWT_secret=process.env.JWT_SECRET

exports.patientlogin=async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
        let patient=await Patient.findOne({email});
        if(!patient){
            return res.status(400).json({ error:"enter valid credentials" });
        }
        const passwordcompare= await bcrypt.compare(password,patient.password);
        if(!passwordcompare){
            return res.status(400).json({ error:"enter valid credentials" });
        }
        const data={
            patient:{
                id:patient._id
            },
            email:patient.email
        }
        const authtoken=jwt.sign(data,JWT_secret);
        const success=true;
        res.json({authtoken})   
    }
    catch(error){
        console.error(error.message)
        res.status(500).send(" internal server error ");
    }
}

exports.patientdetails=async (req,res)=>{
    try{
        const token= req.header('auth-token')
        const JWT_secret=process.env.JWT_SECRET;
        const data=jwt.verify(token,JWT_secret)
        let userId=data.patient.id;
        // console.log(userId)
        const user=await Patient.findById(userId).select('-password')
        res.send(user);
    }
    catch(error){
        console.error(error.message)
        res.status(500).send(" internal server error ");
    }
    }

exports.patientsignup= async (req,res)=>{
    // if errors are present then bad request is returned
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({success, errors: errors.array() });
    }
    // checking whether user with same email exists
    try{
        let patient=await Patient.findOne({email:req.body.email})
        console.log(patient);
        if(patient){
            return res.status(400).json({success: false,error: "Sorry this email already exists"});
        }
        else{
            // res.status(200).send("success : true");
            const salt=await bcrypt.genSalt();
            let secpass= await bcrypt.hash(req.body.password,salt);
        
            //creating a new user
            patient=await Patient.create({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                password: secpass ,
                phone_number:req.body.phNumber,
                street:req.body.street,
                city:req.body.city,
                postal:req.body.postal,
                state:req.body.state,
                country:req.body.country,
                age: req.body.age,
                sex: req.body.sex,
                blood_group: req.body.bloodGroup,
            })
            const data={
                patient:{
                    id: patient.id
                }
            }
        const authtoken=jwt.sign(data,JWT_secret);
        let success=true;
        console.log(success,authtoken);
        res.json({authtoken})   
        // .then(user => res.json(user))
        // .catch(err=>{console.log(err)
        //     res.json({error: "please enter a unique value for email"})})
        }
}
catch(error){
    console.error(error.message)
    res.status(500).send("Internal server error ");
}
}

// sendOtp
exports.sendOtp = async(req,res) => {
    
    try{
        // fetch email from request ki body
        const {email} = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success:false,
                message:"User already registered"
            })
        }

        // if not 
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("OTP Generated : ",otp);

        // check otp is unique or not
        const result = await Otp.findOne({otp:otp});
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
        const otpPayload = {email,otp};

        // create an entry for otp in db
        const otpBody = await Otp.create(otpPayload);
        console.log("OTP Body",otpBody);

        // return response successful
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}





// // change password
// exports.changePassword = async (req, res) => {
// 	try {
// 		// Get user data from req.user
// 		const userDetails = await User.findById(req.user.id);

// 		// Get old password, new password, and confirm new password from req.body
// 		const { oldPassword, newPassword, confirmNewPassword } = req.body;

// 		// Validate old password
// 		const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);
// 		if (!isPasswordMatch) {
// 			// If old password does not match, return a 401 (Unauthorized) error
// 			return res.status(401).json({ success: false, message: "The password is incorrect" });
// 		}

// 		// Match new password and confirm new password
// 		if (newPassword !== confirmNewPassword) {
// 			// If new password and confirm new password do not match, return a 400 (Bad Request) error
// 			return res.status(400).json({
// 				success: false,
// 				message: "The password and confirm password does not match",
// 			});
// 		}

// 		// Update password
// 		const encryptedPassword = await bcrypt.hash(newPassword, 10);
// 		const updatedUserDetails = await User.findByIdAndUpdate(
// 			req.user.id,
// 			{ password: encryptedPassword },
// 			{ new: true }
// 		);

// 		// Send notification email
// 		try {
// 			const emailResponse = await mailSender(
// 				updatedUserDetails.email,
// 				passwordUpdated(
// 					updatedUserDetails.email,
// 					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
// 				)
// 			);
// 			console.log("Email sent successfully:", emailResponse.response);
// 		} 
//         catch (error) {
// 			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
// 			console.error("Error occurred while sending email:", error);
// 			return res.status(500).json({
// 				success: false,
// 				message: "Error occurred while sending email",
// 				error: error.message,
// 			});
// 		}

// 		// Return success response
// 		return res.status(200).json({ success: true, message: "Password updated successfully" });
// 	} 
//     catch (error) {
// 		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
// 		console.error("Error occurred while updating password:", error);
// 		return res.status(500).json({
// 			success: false,
// 			message: "Error occurred while updating password",
// 			error: error.message,
// 		});
// 	}
// };

