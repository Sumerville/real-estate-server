const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const VerifyCode = require("../models/verifyModel");
const nodemailer = require("nodemailer");
const { validationResult } = require ("express-validator");





// register User
const transporter = nodemailer.createTransport({
    service:"Gmail",
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  
  // registerr User and send verification otp
  router.post("/register", async(req, res)=>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
  }
    const {userName, email, password, city, mobile}=req.body;
    try {
   // check if user exist
   const newUser = await User.findOne({email: req.body.email})
   if (newUser) {
     // throw new error("User Already Exist")
     return res.status(404).json({
      errors:[{msg:"User with this email Already Exist"}]  
     })
  }
  const user = new User({
    userName: userName,
    password: await bcrypt.hash(req.body.password,10),
    email: email,
    city: city, 
    mobile:mobile
  });
  await user.save();
  
  const otpcode = new VerifyCode({
    email: user.email,
    otp:Math.floor(100000 + Math.random() *900000)
  })
  await otpcode.save()
  const mailOptions ={
    from: '"Summer Homes Team 👻" <acadsumerville@gmail.com>',
    to:email,
    subject:"Sumer Homes Verification Code",
    html:`<div>
    <p> Hi ${userName} </p>
    <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
    <p>please make sure to verify your account using the code below </p>
    <p> Verification code</p>
    <h1>${otpcode.otp}</h1>
    <p>If you need any help with activating your account, please don't hesitate to contact us!🙏 </p>
    <p> Send us mail @</p>
    <h3> acadsumerville@gmail.com.</h3>
    </div>`
  }
  
  transporter.sendMail(mailOptions,(err,succses)=>{ 
    if(err){
      console.log(err)
      return res.status(500).json({ errors:[{msg:err.message}]})
   
    }else{
      return res.status(200).json({message:"otp sent"})
    }
  })
  res.status(200).json({
    success:true,
    message:"User Created Successfully"
  })
  
    } catch (error) {
      res.status(500).json({
        success: false,
        errors:[{msg:error.message}]
    }) 
    }
  });


  // user login

router.post("/login", async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}

    try {
    const {email} = req.body; 
      //  Check if email and password exists

      if(!email){
        return res.status(400).json({errors:[{msg:"Please provide email and Password"}]})
     
      }

//  Check if user exists
const checkUser = await User.findOne({email:req.body.email})
if(!checkUser){
return res.status(401).json({errors:[{msg:"User With this email not found!"}]})
}

if(!checkUser.isVerified){
  return res.status(400).json({errors:[{msg:"Account has not been verified, check your email to verify your account."}]})
}
  // compare password
  const validPassword = await bcrypt.compare(
    req.body.password,
    checkUser.password
);
if (!validPassword) {
    // throw new error("Invalid Password");
    return res.status(404).json({
        errors:[{msg:"Invalid Password!"}]
    })
}
 // generate and assign token
 const token = jwt.sign({ userId: checkUser._id }, process.env.JWT_SECRET_KEY,{
  expiresIn:"15d"
});
const {password,...rest} = checkUser._doc;
// send response
res.cookie("access_token", token, {
  httpOnly:true
}).status(200).json({
    success: true,
    message: "User loged in successfully", 
    data: {...rest}
})
    } catch (error) { 
       res.status(500).json({
            success: false,
            errors:[{msg:"Network error"}]
        })  
    }
});




module.exports = router;