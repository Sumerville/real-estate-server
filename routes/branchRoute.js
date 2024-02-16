const router = require("express").Router();
const Landlord = require("../models/landlordModel");
const Branch = require("../models/branchModel")


// get all branches

router.get("/allBranches", async (req, res) => {
    try {
      const { landlord } = req.query;
      let branches = [];
  
      if (landlord) {
        branches = await Branch.find({ landlordId: landlord }).populate(
          "landlordId"
        );
      } else {
        branches = await Branch.find()
      }
      res.json(branches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get a branch by ID
router.get("/:id", async (req, res) => {
    try {
      const branchId = req.params.id;
      const branch = await Branch.findById(branchId)
      .populate("landlordId")
      .select("-password")
      if (!branch) {
        res.status(404).json({ msg: "Branch not found", code: 404 });
      } else {
        res.status(200).json(branch);
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

// get branches by landlordId
  
router.get("/:landlordId/myBranches", async (req, res) => {
  landlordId = req.params.landlordId
      try {
          const branches = await Branch.find({
              landlordId, isDeleted:false
          }).populate("landlordId")
           res.status(200).json({
              success: true,
              data: { branches }
          })
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  })

// Get archived branches
router.get("/", async (req, res) => {
  try {
    const archiveBranch = await Branch.find({ isDeleted: true });

    res.status(200).json(archiveBranch);
  } catch (error) {
 
    res.status(500).json({ error: "Internal server error" });
  }
});

// register Branch
router.post("/register", async(req, res)=>{
    try {
        const branch = new Branch(req.body);
         await branch.save();
         res.status(200).json({
            success:true,
            message:"Branch Created Successfully"
         }) 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})

//update a branch
router.put("/updateBranch/:id", async (req, res) => {
  const branchId = req.params.id;

  try {
      const updatedBranch = await Branch.findByIdAndUpdate(branchId, {
          $set: req.body
      }, { new: true });
      res.status(200).json({
          success: true,
          message: "branch Updated successfully",
          data: updatedBranch
      })
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "cannot update branch"
      })
  }
});

// archive a branch
router.put("/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);

    if (!branch) {
      return res
        .status(404)
        .json({ message: "The id supplied does not exist", code: 404 });
    }

    branch.isDeleted = true; 
    await branch.save(); 

    res.status(200).json({ message: "branch archived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// unarchive a branch
router.put("/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);

    if (!branch) {
      return res
        .status(404)
        .json({ message: "The id supplied does not exist", code: 404 });
    }

    branch.isDeleted = false; 
    await branch.save(); 

    res.status(200).json({ msg: "branch unarchived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete a branch
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBranch = await Branch.findById(id);

    if (!deleteBranch) {
      res.status(404).json({ message: "Branch not found", code: 404 });
    } else {
    
      await deleteBranch.deleteOne();

      res.status(200).json({ message: "Branch deleted successfully", code: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router