const router = require("express").Router();
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const OtpCode = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require ("express-validator");
const jwt = require("jsonwebtoken");

// Get All Users 
router.get("/allUsers", async (req, res) => {
    try {
      const users = await User.find({isDeleted:false}).select("-password");
  
      res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error" });
    }
  }); 

// get users by landlord
router.get("/:id/lanUsers", async (req, res) => {

    try {
        const lanUsers = await User.find({
            landlordId: req.params.id, isDeleted:false
        }).select("-password")
        if(!lanUsers){
            res.status(404).json({
                message:"Users Belonging to this Landlord not found"
            })
        }
        else res.status(200).json(lanUsers)
    } catch (error) {

    }
});


// get user by branch
router.get("/:branchId/branchUsers", async (req, res) => {
branchId = req.params.branchId
    try {
        const branchUser = await User.find({
            branchId, isDeleted:false
        }).select("-password")
        return res.status(200).json({
            success: true,
            data: { branchUser }
        })
    } catch (error) {

    }
})

// get user a single user

router.get("/:id", async(req, res)=>{
    try{
        const userId = req.params.id;
        const user = await User.findById(userId)
        .select("-password");
    
        if(!user) {
          res.status(404).json({ message: "user not found", code: 404 });
        } 
        res.status(200).json({
          success:true,
          user
        })
      } catch (err) {
        res.status(500).json({ err: err.message });
      }
});

// Get all archived user
router.get("/", async (req, res) => {
    try {
      const archiveUser = await User.find({ isDeleted: true }).select("-password");
  
      res.status(200).json(archiveUser);
    } catch (error) {
     
      res.status(500).json({ error: "Internal server error" });
    }
  });
  


router.put("/update/:id", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
        // create error if atempt to update password
        if (req.body.password) {
            return res.status(400).json({
                message: "Please use reset password for password update "
            })
        }
  // verify that user account is verified
const isUser = await User.findOne({isVerified: true});
if(!isUser){
  return res.status(400).json({
    errors:[{msg:"You are not verified"}]  
   })
}

  // verify token

  const token = req.cookies.access_token;
  if(!token){  return res.status(400).json({
    errors:[{msg:"You are not Authenticated"}]  
   })}

   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
   if(err) {return res.status(400).json({
      errors:[{msg:"Invalid token"}]  
     })}
     req.user = user; 
   })
        // update user info
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        // remove password from returned data
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            message: "user updated successfully",
            data: { ...rest }
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: "Can not update user"
        })
    }
});

// archive a user
router.put("/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res
          .status(404)
          .json({ msg: "The id supplied does not exist", code: 404 });
      }
  
      user.isDeleted = true; 
      await user.save(); 
  
      res.status(200).json({ msg: "User archived" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

// unarchive a user
router.put("/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ msg: "The id supplied does not exist", code: 404 });
    }

    user.isDeleted = false; 
    await user.save(); 

    res.status(200).json({ msg: "User unarchived" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//delete user account 

router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findById(id);
  
      if (!deletedUser) {
        res.status(404).json({ msg: "User not found", code: 404 });
      } else {
      
        await deletedUser.deleteOne();
  
        res.status(200).json({ msg: "User deleted successfully", code: 200 });
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
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

  //Request otp to reset password

  router.post("/otp/user", async(req, res)=>{
    const {email}=req.body;
    try {
     const validEmail = await User.findOne({email: req.body.email, isVerified: true});
     if(!validEmail){
       return res.status(400).json("Invalid Credentials!");
     }
     await OtpCode.deleteOne({email})
     const newOtp = new OtpCode({
       email: req.body.email,
       otp:Math.floor(100000 + Math.random() *900000),
       expireIn: new Date().getTime() + 300*1000
     })
     await newOtp.save(); 

     const mailOptions ={
      from: '"Summer Homes Team, 👻" <acadsumerville@gmail.com>',
      to:email,
      subject:"Password reset Code",
      html:`<div>
      <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
      <p> This is your Otp to reset your password</p>
      <h1>${newOtp.otp}</h1>
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

 //Resend otp to reset password
  router.post("/resend-otp/user", async(req, res)=>{
    const {email}=req.body;
    try {
     const validEmail = await User.findOne({email: req.body.email, isVerified: true});
     if(!validEmail){
       return res.status(400).json("Invalid Credentials!");
     }
     await OtpCode.deleteOne({email})
     const newOtp = new OtpCode({
       email: req.body.email,
       otp:Math.floor(100000 + Math.random() *900000),
       expireIn: new Date().getTime() + 300*1000
     })
     await newOtp.save(); 

     const mailOptions ={
      from: '"Summer Homes Team, 👻" <acadsumerville@gmail.com>',
      to:email,
      subject:"Password reset Code",
      html:`<div>
     
      <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
      <p>This is your Otp to reset your password</p>
      <h1>${newOtp.otp}</h1>
      <p>If you need any help, please don't hesitate to contact us!🙏 </p>
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

     // update password
router.post("/reset-password", async(req, res)=>{
  try {
    let {email, otp, newPassword} = req.body;
    if(!(email && otp && newPassword)){
      return res.status(400).json("Empty Credentials not allowed!");
    }
    let validCredencials = await OtpCode.findOne({email, otp});
    if(!validCredencials){
      return res.status(400).json("Invalid Credentials!"); 
    }
    if(validCredencials){
      let currentTime = new Date().getTime();
      let diff = validCredencials.expireIn - currentTime;
      if(diff < 0){
        return res.status(400).json("Otp has expired!"); 
      }
    }
    if(newPassword.length < 8){
      return res.status(400).json("Password must be 8 characters and above!"); 
    }
  const newPass = await bcrypt.hash(req.body.newPassword,10);
    await User.updateOne({email},{password:newPass});
    res.status(200).json({
      success: true,
      message:"password updated successfully"
    })
    await OtpCode.deleteOne({email})
  } catch (err) {
    res.status(500).json({ err: err.message }); 
  }
});



    

module.exports = router;

