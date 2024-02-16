const router = require("express").Router();
const Admin = require("../models/adminModel");


// Get All admins
router.get("/allAdmins", async (req, res) => {
    try {
      const users = await Admin.find({isDeleted:false});
  
      res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error" });
    }
  });

// get admins by landlord
router.get("/:landlordId/lanAdmins", async (req, res) => {

    try {
        const lanAdmins = await Admin.find({
            landlordId: req.params.landlordId, isDeleted:false
        }).populate("branchId")
        if(!lanAdmins){
            res.status(404).json({
                message:"Admins Belonging to this Landlord not found"
            })
        }
        else res.status(200).json(lanAdmins)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get admins by branch
router.get("/:branchId/branchAdmins", async (req, res) => {
    branchId = req.params.branchId
        try {
            const branchAdmins = await Admin.find({
                branchId, isDeleted:false
            }).populate("branchId")
    
    
            return res.status(200).json({
                success: true,
                data: { branchAdmins }
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

// get user a single admin

router.get("/:id", async(req, res)=>{
    try{
        const userId = req.params.id;
        const user = await Admin.findById(userId).populate("branchId")
    
        if(!user) {
          res.status(404).json({ message: "user not found", code: 404 });
        } 
        res.status(200).json(user)
      } catch (err) {
        res.status(500).json({ err: err.message });
      }
});

// Get all archived admins
router.get("/", async (req, res) => {
    try {
      const archiveUser = await Admin.find({ isDeleted: true });
  
      res.status(200).json(archiveUser);
    } catch (error) {
     
      res.status(500).json({ error: "Internal server error" });
    }
  });

// register an admin
router.post("/register", async(req, res)=>{
    try {
        // check if user exist
        const user = await Admin.findOne({ email: req.body.email })
        if (user) {
        
            return res.status(404).json({
                message:"User Already Exist"
            })
        }
        const admin = new Admin(req.body);
         await admin.save();
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
})

// Admin login

router.post("/login", async(req, res)=>{
    try {
         // check if user exist
         const user = await Admin.findOne({ email: req.body.email });
         if (!user) {
             return res.status(404).json({
                 message:"User Not Found"
             
             })
         }
res.status(200).json({
    message:"Admin Logged in successfully",
    data:{user}
})
    } catch (error) {
       res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})

// update admin

router.put("/update/:id", async (req, res) => {

    try {
        // create error if atempt to update password
        if (req.body.password) {
            return res.status(400).json({
                message: "Please use reset password for password update "
            })
        }

        // update admin info
        const updatedUser = await Admin.findByIdAndUpdate(req.params.id, {
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
  
  // unarchive a landlord
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