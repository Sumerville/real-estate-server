const router = require("express").Router();
const Landlord = require("../models/landlordModel");
const Admin = require("../models/adminModel");
const VerifyCode = require("../models/verifyModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const {validationResult} = require("express-validator");


// Verify Landlord 
router.post("/verify/landlord", async(req, res)=>{
    try {
      let {email, otp}=req.body;
      if(!email && otp){
        return res.status(400).json("Please enter the otp to verify your account");
      }
      const validOtp = await VerifyCode.findOne({email, otp});
      if(!validOtp){
        return res.status(404).json("Invalid Credentials")
      }
      await Landlord.updateOne({email},{isVerified:true})
      res.status(200).json({email, isVerified: true})
      await VerifyCode.deleteOne({email,otp})
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: "Can not verify landlord"
    })
    }
    });

// Verify Admin 
router.post("/verify/admin", async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
  try {
    let {email, otp}=req.body;
    if(!email && otp){
      return res.status(400).json({ errors:[{msg:"Please Enter Otp to verify your account"}] });
    }
    const validOtp = await VerifyCode.findOne({email, otp});
    if(!validOtp){
      return res.status(404).json({ errors:[{msg:"Invalid Credencials"}] })
    }
    await Admin.updateOne({email},{isVerified:true})
    res.status(200).json({email, isVerified: true})
    await VerifyCode.deleteOne({email,otp})
  } catch (error) {
    res.status(500).json({
      sucess: false,
      errors:[{msg:"Network error"}]
  })
  }
  });

  // Verify user with email and otp
router.post("/verify/user", async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
  try {
    let {email, otp}=req.body;
    if(!email && otp){
      return res.status(400).json({ errors:[{msg:"Please Enter Otp to verify your account"}]});
    }
    const validOtp = await VerifyCode.findOne({email, otp});
    if(!validOtp){
      return res.status(404).json({ errors:[{msg:"Invalid Credencials"}]})
    }
    await User.updateOne({email},{isVerified:true})
    res.status(200).json({email, isVerified: true})
    await VerifyCode.deleteOne({email,otp})
  } catch (error) {
    res.status(500).json({
      sucess: false,
      errors:[{msg:"Network error"}]
  })
  }
  });
    

    // Verify user otp only
router.post("/verify/user2", async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
  try {
    let {otp}=req.body;
    if(!otp){
      return res.status(400).json({ errors:[{msg:"Please Enter Otp to verify your account"}]});
    }
    const validOtp = await VerifyCode.findOne({otp});
    if(!validOtp){
      return res.status(404).json({ errors:[{msg:"Invalid Credencials"}]})
    }
    await User.updateOne({isVerified:true})
    res.status(200).json({isVerified: true})
    await VerifyCode.deleteOne({otp})
  } catch (error) {
    res.status(500).json({
      sucess: false,
      errors:[{msg:"Network error"}]
  })
  }
  });



    // create transporter
const transporter = nodemailer.createTransport({
  service:"Gmail",
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

        // Resend Otp for Landlord

    router.post("/resend-otp/landlord", async(req, res)=>{
      const {email}=req.body;
     try {
      const validEmail = await Landlord.findOne({email: req.body.email, isVerified: false});
      if(!validEmail){
        return res.status(400).json("Invalid Credentials!");
      }
      await VerifyCode.deleteOne({email})
      const newOtp = new VerifyCode({
        email: req.body.email,
        otp:Math.floor(100000 + Math.random() *900000)
      })
      await newOtp.save();
      const mailOptions ={
        from: '"Summer Homes Team, 👻" <acadsumerville@gmail.com>',
        to:email,
        subject:"Verification Code",
        html:`<div>
        <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
        <p> This is Your new Verification code</p>
        <h1>${newOtp.otp}</h1>
        <p> Please verify your account befor you sign in </p>
        <p>If you need any help with activating your account, please don't hesitate to contact us!🙏 </p>
        <p> Send us mail @</p>
        <h3> acadsumerville@gmail.com.</h3>
        </div>`
      }
      transporter.sendMail(mailOptions,(err,succses)=>{ 
        if(err){
          console.log(err)
        }else{
          return res.status(200).json({message:"otp sent"})
        }
      })
      res.status(200).json({
        success: true,
        message:"Otp created"
      })
     } catch (err) {
      res.status(500).json({ err: err.message }); 
     }
    }); 

    
  // Resend Otp for Admin

    router.post("/resend-otp/admin", async(req, res)=>{
      const errors =validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
      const {email}=req.body;
      try {
       const validEmail = await Admin.findOne({email: req.body.email, isVerified: false});
       if(!validEmail){
        return res.status(404).json({ errors:[{msg:"Invalid Credencials"}] })
       }
       await VerifyCode.deleteOne({email})
       const newOtp = new VerifyCode({
         email: req.body.email,
         otp:Math.floor(100000 + Math.random() *900000)
       })
       await newOtp.save();

       const mailOptions ={
        from: '"Summer Homes Team, 👻" <acadsumerville@gmail.com>',
        to:email,
        subject:"Verification Code",
        html:`<div>
       
        <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
        <p> This is your new Verification code</p>
        <h1>${newOtp.otp}</h1>
        <p>Please verify your account befor you sign in </p>
        <p>If you need any help with activating your account, please don't hesitate to contact us!🙏 </p>
        <p> Send us mail @</p>
        <h3> acadsumerville@gmail.com.</h3>
        
        </div>` 
      }
      transporter.sendMail(mailOptions,(err,succses)=>{ 
        if(err){
          console.log(err)
        }else{
          return res.status(200).json({message:"otp sent"})
        }
      })
       res.status(200).json({
         success: true,
         message:"Otp created"
       })
      } catch (err) {
        res.status(500).json({
          sucess: false,
          errors:[{msg:"Network error"}]
      })
      }
     }); 

  // Resend Otp for User

  router.post("/resend-otp/user", async(req, res)=>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
  }
    const {email}=req.body;
    try {
     const validEmail = await User.findOne({email: req.body.email, isVerified: false});
     if(!validEmail){
      return res.status(404).json({ errors:[{msg:"Invalid Credencials"}] })
     }
     await VerifyCode.deleteOne({email})
     const newOtp = new VerifyCode({
       email: req.body.email,
       otp:Math.floor(100000 + Math.random() *900000)
     })
     await newOtp.save(); 

     const mailOptions ={
      from: '"Summer Homes Team, 👻" <acadsumerville@gmail.com>',
      to:email,
      subject:"Verification Code",
      html:`<div>
     
      <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
      <p> This is your new Verification code</p>
      <h1>${newOtp.otp}</h1>
      <p>Please verify your account befor you sign in </p>
      <p>If you need any help with activating your account, please don't hesitate to contact us!🙏 </p>
      <p> Send us mail @</p>
      <h3> acadsumerville@gmail.com.</h3>
      
      </div>` 
    }
    transporter.sendMail(mailOptions,(err,succses)=>{ 
      if(err){
        console.log(err)
      }else{
        return res.status(200).json({message:"otp sent"})
      }
    })
     res.status(200).json({
       success: true,
       message:"Otp created"
     })
    } catch (err) {
      res.status(500).json({
        sucess: false,
        errors:[{msg:"Network error"}]
    }) 
    }
   }); 


    module.exports = router