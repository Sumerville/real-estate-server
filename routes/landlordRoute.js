const router = require("express").Router();
const Landlord = require("../models/landlordModel");

// get all landlords
router.get("/allLandlords", async (req, res) => {
    try {
      const landlords = await Landlord.find()
      res.status(200).json({
        status: "success",
        data: landlords,
      });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

// get a single Landlord

router.get("/:id", async(req, res)=>{
    try{
        const userId = req.params.id;
        const user = await Landlord.findById(userId);
    
        if(!user) {
          res.status(404).json({ message: "Landlord not found", code: 404 });
        } 
        res.status(200).json(user)
      } catch (err) {
        res.status(500).json({ err: err.message });
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

// register Landlord
router.post("/register", async(req, res)=>{
    try {
        const admin = new Landlord(req.body);
         await admin.save();
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
})

// Landlord login

router.post("/login", async(req, res)=>{
    try {
         // check if user exist
         const user = await Landlord.findOne({ email: req.body.email });
         if (!user) {
             return res.status(404).json({
                 message:"User Not Found"
             
             })
         }
res.status(200).json({
    message:"Landlord Logged in successfully",
    data:{user}
})
    } catch (error) {
       res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})
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

module.exports = router