const router = require("express").Router();
const Landlord = require("../models/landlordModel");
const Branch = require("../models/branchModel");
const Admin = require("../models/adminModel");
const Tenant = require("../models/tenantModel");
const TenantMsg = require("../models/tenantmsgModel");
const Flat = require("../models/flatModel");
const Building = require("../models/buildingModel");
const Email = require("../utils/Email");
const nodemailer = require("nodemailer");
const OtpCode = require("../models/otpModel");
const VerifyCode = require("../models/verifyModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require ("express-validator");


// get all landlords
router.get("/all-landlords", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
      const users = await Landlord.find({isDeleted:false}).select("-password");
     
     return  res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({errors:[{msg:"Something Went Wrong"}]});
    }
  });
  

// get a single Landlord

router.get("/:id", async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try{
        const userId = req.params.id;
        const user = await Landlord.findById(userId);
    
        if(!user) {
          res.status(404).json({errors:[{msg:"Landlord not found"}]});
        } 
        res.status(200).json(user)
      } catch (err) {
        res.status(500).json({
          success: false,
          errors:[{msg:"Network error"}]
      }) 
      }
});

// get Landlord by admindId
  
router.get("/:id/lan", async (req, res) => {
  const adminId = req.params.id
      try {
          const landlord = await Landlord.find({
            adminId, isDeleted:false
          }).populate("adminId").select("-password")
           res.status(200).json({
              success: true,
              landlord
          })
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  });



// Get archived landlords
router.get("/", async (req, res) => {
  try {
    const archiveLan = await Landlord.find({ isDeleted: true });

    res.status(200).json(archiveLan);
  } catch (error) {
 
    res.status(500).json({ error: "Internal server error" });
  }
});


// register a Landlord1
router.post("/reg", async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
  try {
      // check if user exist
      const user = await Landlord.findOne({ email: req.body.email })
      if (user) {
      
        return res.status(404).json({ errors:[{msg:"Landlord Already Exist"}] })
      }
      const lan = new Landlord(req.body);
       (await lan.save());
       res.status(200).json({
          success:true,
          message:"Landlord Created Successfully"
       }) 
  } catch (error) {
    res.status(500).json({
      success: false,
      errors:[{msg:"Network error"}]
  }) 
  }
});




// register Landlord
const transporter = nodemailer.createTransport({
  service:"Gmail",
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

// registerr landlord and send verification otp
router.post("/register", async(req, res)=>{
  const {userName, email, password, address}=req.body;
  try {
 // check if landlord exist
 const landlord = await Landlord.findOne({email: req.body.email})
 if (landlord) {
   // throw new error("User Already Exist")
   return res.status(404).json({
       message:"Landlord Already Exist"
   })
}
const lanLord = new Landlord({
  userName: userName,
  password: await bcrypt.hash(req.body.password,10),
  email: email,
  address: address, 
});
await lanLord.save();

const otpcode = new VerifyCode({
  email: lanLord.email,
  otp:Math.floor(100000 + Math.random() *900000)
})
await otpcode.save()
const mailOptions ={
  from: '"Summer Homes 👻" <acadsumerville@gmail.com>',
  to:email,
  subject:"Registration credentials",
  html:`<div>
  <p> Hi ${userName} </p>
  <h2>Welcome to Sumer Homes, we're glad to have you 🎉</h2>
  <p>please make sure to verify your account using the code below </p>
  <p> Verification code</p>
  <h1>${otpcode.otp}</h1>
  <p> After verifying your acount, sign in with the password below; and make sure to it afterwards </p>
  <p> Passcword</p>
  <h1>${password}</h1>
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
  success:true,
  message:"Landlord Created Successfully"
})

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
  }) 
  }
});

// Landlord login

router.post("/login", async(req, res)=>{

  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}

    try {
      const {email}= req.body;
      //  Check if email and password exists

      if(!email){
        return res.status(400).json({errors:[{msg:"Please provide email and Password"}]})
      }

//  Check if Admin exists
const landlord = await Landlord.findOne({email:req.body.email})
if(!landlord){
  return res.status(401).json({errors:[{msg:"User With this email not found!"}]})
}

if(!landlord.isVerified){
  return res.status(400).json({errors:[{msg:"Account has not been verified, check your email to verify your account."}]})
}
  // compare password
  const validPassword = await bcrypt.compare(
    req.body.password,
    landlord.password
);
if (!validPassword) {
    // throw new error("Invalid Password");
    return res.status(404).json({
      errors:[{msg:"Invalid Password!"}]
    })
}
 // generate and assign token
 const token = jwt.sign({ userId: landlord._id }, process.env.JWT_SECRET_KEY,{
  expiresIn:"15d"
});
const {password,...rest} = landlord._doc;
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
            message: error.message
        })  
    }
});

// upate landlord
router.put("/update/:id", async (req, res) => {

    try {
        // create error if atempt to update password
        if (req.body.password) {
            return res.status(400).json({
                message: "Please use reset password for password update "
            })
        }

        // update Landlord info
        const updatedUser = await Landlord.findByIdAndUpdate(req.params.id, {
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

// archive a landlord
router.put("/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const landlord = await Landlord.findById(id);

    if (!landlord) {
      return res
        .status(404)
        .json({ msg: "The id supplied does not exist", code: 404 });
    }

    landlord.isDeleted = true; 
    await landlord.save(); 

    res.status(200).json({ message: "Landlord archived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// unarchive a landlord
router.put("/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;
    const landlord = await Landlord.findById(id);

    if (!landlord) {
      return res
        .status(404)
        .json({ msg: "The id supplied does not exist", code: 404 });
    }

    landlord.isDeleted = false; 
    await landlord.save(); 

    res.status(200).json({ message: "Landlord unarchived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  //Request otp to reset password

  router.post("/otp/landlord", async(req, res)=>{
    const {email}=req.body;
    try {
     const validEmail = await Landlord.findOne({email: req.body.email, isVerified: true});
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
   const validEmail = await Landlord.findOne({email: req.body.email, isVerified: true});
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
        await Landlord.updateOne({email},{password:newPass});
        res.status(200).json({
          success: true,
          message:"password updated successfully"
        })
        await OtpCode.deleteOne({email})
      } catch (err) {
        res.status(500).json({ err: err.message }); 
      }
    });


//delete landlord account 

router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await Landlord.findById(id);
  
      if (!deletedUser) {
        res.status(404).json({ message: "Landlord not found", code: 404 });
      } else {
      
        await deletedUser.deleteOne();
  
        res.status(200).json({ message: "Landlord deleted successfully", code: 200 });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // deleting a landlord and all his posts
  router.delete("/deleteLandlord/:id", async(req, res)=>{
    if(req.body.userId === req.params.id){
    try {
      const user = await Landlord.findById(req.params.id)
      try {
       await Landlord.findByIdAndDelete(req.params.id);
        await Branch.deleteMany({landlordId: user._id})
        await Building.deleteMany({landlordId: user._id})
        await Admin.deleteMany({landlordId: user._id})
        await TenantMsg.deleteMany({landlordId: user._id}) 
        await Tenant.deleteMany({landlordId: user._id})
         await Flat.deleteMany({landlordId: user._id})
        res.status(201).json("Landlord deleted ")
      } catch (error) {
       res.status(500).json(error) 
       console.log(error)
      }
    } catch (error) {
     res.status(404).json("Landlord not found"); 
     console.log(error)
    }
    
    }else{
      res.status(404).json("You can only delete your account");
    }
    });

module.exports = router