const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { validationResult } = require('express-validator');
const Doctor = require("../models/DoctorProfile");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
// const Profile = require("../models/Profile");
require("dotenv").config();
const JWT_secret=process.env.JWT_SECRET

exports.doctorlogin=async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
        let doctor=await Doctor.findOne({email});
        if(!doctor){
            return res.status(400).json({ error:"enter valid credentials" });
        }
        const passwordcompare= await bcrypt.compare(password,doctor.password);
        if(!passwordcompare){
            return res.status(400).json({ error:"enter valid credentials" });
        }
        const data={
            doctor:{
                id:doctor.id
            }
        }
        console.log(doctor);
        const authtoken=jwt.sign(data,JWT_secret);
        const success=true;
        res.json({success,authtoken})    
    }
    catch(error){
        console.error(error.message)
        res.status(500).send(" internal server error ");
    }
}

exports.doctordetails=async (req,res)=>{
    try{
        const token= req.header('auth-token')
        const JWT_secret=process.env.JWT_SECRET;
        const data=jwt.verify(token,JWT_secret)
        let userId=data.doctor.id;
        console.log(userId)
        const user=await Doctor.findById(userId).select('-password');
        res.send(user);
    }
    catch(error){
        console.error(error.message)
        res.status(500).send(" internal server error ");
    }
    }
exports.doctorsignup= async (req,res)=>{
    // if errors are present then bad request is returned
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({success, errors: errors.array() });
    }
    // checking whether user with same email exists
    try{
        let doctor=await Doctor.findOne({email:req.body.email})
        console.log(doctor);
        if(doctor){
            return res.status(400).json({success: false,error: "Sorry this email already exists"});
        }
        // res.status(200).send("success : true");
        const salt=await bcrypt.genSalt();
        let secpass= await bcrypt.hash(req.body.password,salt);
    
        //creating a new user
        doctor=await Doctor.create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: secpass ,
            phone_number:req.body.phNumber,
            imr_number:req.body.imrNumber,
            
        })
        const data={
            doctor:{
                id: doctor.id
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
catch(error){
    console.error(error.message)
    res.status(500).send("Internal server error ");
}
}

//send otp
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

// signup
exports.signUp = async(req,res) => {

    try{
        // data fetch from requset ki body
        const {firstName,lastName,email,password,confirmPassword,imr_number,otp} = req.body;

        // validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !imr_number||!otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        // password match krlo
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password value does not match. Please try again!"
            })
        }

        // check user already exist or not
        const existingUser = await Doctor.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered. Please, sign in to continue"
            })
        }

        // find most recent otp stored for the user and match with request otp
        const recentOtp = await Otp.find({ email }).sort({ createdAt : -1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length===0){
            // otp not found
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
        else if(otp!==recentOtp[0].otp){
            // invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);
        const hashedRegistration = await bcrypt.hash(imr_number,10);


        // // create entry in DB
        // const profileDetails = await Profile.create({
        //     gender:null,
        //     dob:null,
        //     contactNumber:null,
        //     about:null
        // })

        const user = await Doctor.create({
            firstName,lastName,email,imr_number:hashedRegistration,password:hashedPassword
        })

        // return res successfully
        return res.status(200).json({
            success:true,
            user,
            message:"User registered successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again!"
        })
    }

}
