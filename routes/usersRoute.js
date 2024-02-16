const router = require("express").Router();
const User = require("../models/userModel");

// Get All Users user
router.get("/allUsers", async (req, res) => {
    try {
      const users = await User.find({isDeleted:false});
  
      res.status(200).json(users);
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error" });
    }
  });

// get users by landlord
router.get("/:landlordId/lanUsers", async (req, res) => {

    try {
        const lanUsers = await User.find({
            landlordId: req.params.landlordId, isDeleted:false
        })
        if(!lanUsers){
            res.status(404).json({
                message:"Usrs Belonging to this Landlord not found"
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
        }).populate("branchId")


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
        const user = await User.findById(userId);
    
        if(!user) {
          res.status(404).json({ message: "user not found", code: 404 });
        } 
        res.status(200).json(user)
      } catch (err) {
        res.status(500).json({ err: err.message });
      }
});

// Get all archived user
router.get("/", async (req, res) => {
    try {
      const archiveUser = await User.find({ isDeleted: true });
  
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
  
router.delete("/deleteUser", async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});
module.exports = router;

