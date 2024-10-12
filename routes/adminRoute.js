const router = require("express").Router();
const Admin = require("../models/adminModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Email = require("../utils/Email");
const VerifyCode = require("../models/verifyModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { validationResult } = require ("express-validator");

// Get All admins
router.get("/allAdmins", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
      const users = await Admin.find({isDeleted:false, isVerified:true}).select("-password");
     
     return  res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({errors:[{msg:"User with this email Already Exist"}]});
    }
  });



// Get All  archived admins
router.get("/allArchived", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
      const users = await Admin.find({isDeleted:true}).select("-password");
     
     return  res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({errors:[{msg:"User with this email Already Exist"}]});
    }
  });

// Get All  archived admins by landlord
router.get("/:landlordId/archive", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
      const archivedAdmin = await Admin.find({landlordId: req.params.landlordId, isDeleted:true}).select("-password");
     
     return  res.status(200).json(archivedAdmin);
    } catch (error) {
   
      res.status(500).json({errors:[{msg:"User with this email Already Exist"}]});
    }
  });

  // get admins by role
  router.get("/", async (req, res) => {
    const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
      let admins =[];
      const { role } = req.query;
      if(role){
         admins = await Admin.find({ role, isVerified:true,isDeleted:false }).select("-password")
      }
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({
        success: false,
        errors:[{msg:"Network error"}]
    }) 
    }
  });



// get admins by landlord
router.get("/:landlordId/lanAdmins1", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
        const lanAdmins = await Admin.find({
            landlordId: req.params.landlordId, isDeleted:false
        }).populate("branchId").select("-password")
        if(!lanAdmins){
            res.status(404).json({
            
                errors:[{msg:"Admins Belonging to this Landlord not found"}]
            })
        }
        
        else res.status(200).json({sucess: true,
          data:{lanAdmins}
        })
        
    } catch (error) {
        res.status(500).json({errors:[{msg:"Server error"}]});
    }
});

router.get("/:id/lanAdmins", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
      try {
        const landlordId = req.params.id
          const admins = await Admin.find({
              landlordId, isDeleted:false
          }).populate("landlordId branchId").select("-password")
          if(!admins){
            res.status(404).json({ errors:[{msg:"Admins not found"}] }); 
          }
           res.status(200).json(admins)
      } catch (error) {
        res.status(500).json({errors:[{msg:"Server error"}] });
      }
  });

// get admins by branch
router.get("/:branchId/branchAdmins", async (req, res) => {
    branchId = req.params.branchId;
    const errors =validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
  }
        try {
            const branchAdmins = await Admin.find({
                branchId, isDeleted:false
            }).populate("branchId").select("-password")
    
            if(!branchAdmins){
              res.status(404).json({ errors:[{msg:"Admins not found"}] }); 
            }
            return res.status(200).json({
                success: true,
                data: { branchAdmins }
            })
        } catch (error) {
            res.status(500).json({errors:[{msg:"Server error"}] });
        }
    })

// get a single admin

router.get("/:id", async(req, res)=>{
  try{
      const userId = req.params.id;
      const user = await Admin.findById(userId);
  
      if(!user) {
        res.status(404).json({ message: "Landlord not found", code: 404 });
      } 
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});


// router.get("/:id", async(req, res)=>{
//   const errors =validationResult(req)
//   if(!errors.isEmpty()){
//     return res.status(400).json({errors: errors.array()})
// }
//     try{
//         const userId = req.params.id;
//         const user = await Admin.findById(userId).populate("landlordId branchId")
    
//         if(!user) {
//           res.status(404).json({ errors:[{msg:"Admin not found"}]  });
//         } 
//         const savedUser ={...user._doc, password:undefined}
//         return res.status(200).json({sucess: true, data:{savedUser}})
//       } catch (err) {
//         res.status(500).json({errors:[{msg:"Server error"}] });
//       }
// });

// Get all archived admins
// router.get("/", async (req, res) => {
//   const errors =validationResult(req)
//   if(!errors.isEmpty()){
//     return res.status(400).json({errors: errors.array()})
// }
//     try {
//       const archivedUser = await Admin.find({isDeleted:true});
//       if(!archivedUser) {
//         res.status(404).json({ errors:[{msg:"No archived admins found"}]  });
//       } 
//       res.status(200).json(archivedUser);
//     } catch (error) {
     
//       res.status(500).json({
//         success: false,
//         message: error.message
//     }) 
//     }
//   });

// register an admin
router.post("/reg", async(req, res)=>{

    try {
        // check if user exist
        const user = await Admin.findOne({ email: req.body.email })
        if (user) {
        
            return res.status(404).json({
                message:"User Already Exist"
            })
        }
        const admin = new Admin(req.body);
         (await admin.save());
         res.status(200).json({
            success:true,
            message:"Admin Created Successfully"
         }) 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
});
// registerr Admin and send verification otp
const transporter = nodemailer.createTransport({
  service:"Gmail",
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

router.post("/register", async(req, res)=>{
  const {userName, email, password, role, landlordId, branchId, address, phone}=req.body;
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
  try {
 // check if landlord exist
 const admin = await Admin.findOne({email: req.body.email})
 if (admin) {
   // throw new error("User Already Exist")
   return res.status(404).json({ errors:[{msg:"Admin with this Email Already Exist"}] })
}
const newAdmin = new Admin({
  userName: userName,
  password: await bcrypt.hash(req.body.password,10),
  email: email,
  role: role,
  address: address,
  phone: phone,
  branchId:branchId,
  landlordId:landlordId 
});
await newAdmin.save();

const otpcode = new VerifyCode({
  email: newAdmin.email,
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
  <p> After verifying your acount, sign in with the password below; and make sure to reset it afterwards. Thanks </p>
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
    return res.status(500).json({ errors:[{msg:err.message}]})
  }else{
    return res.status(200).json({message:"otp sent"})
  }
})
res.status(200).json({
  success:true,
  message:"Admin Created Successfully"
})

  } catch (error) {
    res.status(500).json({
      success: false,
      errors:[{msg:"Network error"}]
  }) 
  }
});


// Admin login


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
const adMin = await Admin.findOne({email:req.body.email})
if(!adMin){
return res.status(401).json({errors:[{msg:"User With this email not found!"}]})
}

if(!adMin.isVerified){
  return res.status(400).json({errors:[{msg:"Account has not been verified, check your email to verify your account."}]})
}
// compare password
const validPassword = await bcrypt.compare(
  req.body.password,
  adMin.password
);
if (!validPassword) {
  // throw new error("Invalid Password");
  return res.status(404).json({
    errors:[{msg:"Invalid Password!"}]
  })
}
// generate and assign token
const token = jwt.sign({ userId: adMin._id }, process.env.JWT_SECRET_KEY,{
expiresIn:"15d"
});
const {password,...rest} = adMin._doc;
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

// update admin

router.put("/update/:id", async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
    try {
        // create error if atempt to update password
        if (req.body.password) {
            return res.status(404).json({
              errors:[{msg:"Please use reset password for password update"}]
            })
        }

        // update admin info
        const updatedUser = await Admin.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        // remove password from returned data
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {...rest}
        })
    } catch (error) {
      res.status(500).json({
        success: false,
        errors:[{msg:"Network error"}]
    })
    }
});


  //Request otp to reset password

  router.post("/otp/admin", async(req, res)=>{
    const {email}=req.body;
    try {
     const validEmail = await Admin.findOne({email: req.body.email, isVerified: true});
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
 router.post("/resend-otp/admin", async(req, res)=>{
  const {email}=req.body;
  try {
   const validEmail = await Admin.findOne({email: req.body.email, isVerified: true});
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
      await Admin.updateOne({email},{password:newPass});
      res.status(200).json({
        success: true,
        message:"password updated successfully"
      })
      await OtpCode.deleteOne({email})
    } catch (err) {
      res.status(500).json({ err: err.message }); 
    }
  });

// archive an Admin
router.put("/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);
  
      if (!admin) {
        return res
          .status(404)
          .json({ msg: "The id supplied does not exist", code: 404 });
      }
  
      admin.isDeleted = true; 
      await admin.save(); 
  
      res.status(200).json({ message: "Admin archived" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // unarchive an Admin
  router.put("/:id/unarchive", async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);
  
      if (!admin) {
        return res
          .status(404)
          .json({ msg: "The id supplied does not exist", code: 404 });
      }
  
      admin.isDeleted = false; 
      await admin.save(); 
  
      res.status(200).json({ message: "Admin unarchived" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  //delete admin 
  
  router.delete("/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const deletedUser = await Admin.findById(id);
    
        if (!deletedUser) {
          res.status(404).json({ message: "Admin not found", code: 404 });
        } else {
        
          await deletedUser.deleteOne();
    
          res.status(200).json({ message: "Admin deleted successfully", code: 200 });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


module.exports = router