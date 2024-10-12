const router = require("express").Router();
const Tenant = require("../models/tenantModel");

// Get All Tenants
router.get("/alltenants", async (req, res) => {
    try {
      const users = await Tenant.find({isDeleted:false});
  
      res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error" });
    }
  });

// get tenants by landlord
router.get("/:id/lanTenants", async (req, res) => {

    try {
        const lanUsers = await Tenant.find({
            landlordId: req.params.id, isDeleted:false
        })
        if(!lanUsers){
            res.status(404).json({
                message:"Tenants Belonging to this Landlord not found"
            })
        }
        else res.status(200).json(lanUsers)
    } catch (error) {

    }
});


// get tenants by branch
router.get("/:id/branchUsers", async (req, res) => {
branchId = req.params.id
    try {
        const branchUser = await Tenant.find({
            branchId, isDeleted:false
        }).populate("branchId")


        return res.status(200).json({
            success: true,
            data: { branchUser }
        })
    } catch (error) {

    }
})

// get a single tenant

router.get("/:id", async(req, res)=>{
    try{
        const userId = req.params.id;
        const user = await Tenant.findById(userId);
    
        if(!user) {
          res.status(404).json({ message: "tenant not found", code: 404 });
        } 
        res.status(200).json(user)
      } catch (err) {
        res.status(500).json({ err: err.message });
      }
});

// Get all archived tenants
router.get("/", async (req, res) => {
    try {
      const archiveUser = await Tenant.find({ isDeleted: true });
  
      res.status(200).json(archiveUser);
    } catch (error) {
     
      res.status(500).json({ error: "Internal server error" });
    }
  });
  


router.put("/update/:id", async (req, res) => {

    try {
        // create error if atempt to update password
        if (req.body.password) {
            return res.status(400).json({
                message: "Please use reset password for password update "
            })
        }

        // update user info
        const updatedUser = await Tenant.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        // remove password from returned data
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            message: "tenant updated successfully",
            data: { ...rest }
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: "Can not update tenant"
        })
    }
});

// register a tenant
router.post("/register", async(req, res)=>{
    try {
        // check if user exist
        const user = await Tenant.findOne({ email: req.body.email })
        if (user) {
        
            return res.status(404).json({
                message:"Tenant Already Exist"
            })
        }
        const tenant = new Tenant(req.body);
         await tenant.save();
         res.status(200).json({
            success:true,
            message:"Tenant Created Successfully"
         }) 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})


// archive a tenant
router.put("/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Tenant.findById(id);
  
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

// unarchive a tenant
router.put("/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Tenant.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ msg: "The id supplied does not exist", code: 404 });
    }

    user.isDeleted = false; 
    await user.save(); 

    res.status(200).json({ msg: "Tenant unarchived" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//delete a tenant

router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await Tenant.findById(id);
  
      if (!deletedUser) {
        res.status(404).json({ msg: "Tenant not found", code: 404 });
      } else {
      
        await deletedUser.deleteOne();
  
        res.status(200).json({ msg: "Tenant deleted successfully", code: 200 });
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  

module.exports = router;