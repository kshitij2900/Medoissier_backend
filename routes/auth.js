// // Import the required modules
// const express = require("express")
// const router = express.Router()

// // Import the required controllers and middleware functions
// const {
//   login,
//   signUp,
//   sendOtp,
//   changePassword,
// } = require("../controllers/PatientAuth")
// // const {
// //   resetPasswordToken,
// //   resetPassword,
// // } = require("../controllers/ResetPassword")

// const { fetchuser } = require("../middlewares/fetchuser")

// // Routes for Login, Signup, and Authentication

// // ********************************************************************************************************
// //                                      Authentication routes
// // ********************************************************************************************************

// // Route for user login
// router.post("/patientlogin", login)
// router.post("/doctorlogin", login)

// // Route for user signup
// router.post("/patientsignup", signUp)
// router.post("/doctorsignup", signUp)

// // Route for sending OTP to the user's email
// router.post("/sendotp", sendOtp)

// // Route for Changing the password
// // router.post("/changepassword", fetchuser, changePassword)

// // ********************************************************************************************************
// //                                      Reset Password
// // ********************************************************************************************************

// // Route for generating a reset password token
// // router.post("/reset-password-token", resetPasswordToken)

// // Route for resetting user's password after verification
// // router.post("/reset-password", resetPassword)

// // Export the router for use in the main application
// module.exports = router