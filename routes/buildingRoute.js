const router = require("express").Router();
const Building = require("../models/buildingModel");

//get building by buildingType, city and buildingCategory
router.get("/", async(req,res)=>{
  try {
    let buildings =[];
    const {buildingType,buildingCategory, city,title } = req.query;
    if(buildingType){
      buildings = await Building.find({buildingType})
    }
   if(buildingCategory){
      buildings = await Building.find({buildingCategory})
    }
   if(city){
      buildings = await Building.find({city})
    }
   if(title){
      buildings = await Building.find({title})
    }
    res.send({data:buildings})
  } catch (error) {
    return res.status(500).json(error)
  }
})


// get all buildings
router.get("/allBuildings", async(req,res)=>{
  try {
     const buildings = await Building.find({isDeleted:false}) 
     res.status(200).json({data:buildings})
  } catch (error) {
      res.status(500).json({error: error.message})   
  }
});

// get the number of building for each category

// router.get("/alltype", async(req,res)=>{
//   const buildings = req.query.buildingType.split(",");
//   try {
//     const list = await Promise.all(buildings.map(building=>{
// return Building.countDocuments({building:building})
//     }))
//     res.status(200).json(list)
//   } catch (error) {
//     res.status(500).json({error: error.message})  
//   }
// });

// get buildings without archived ones

router.get("/archived", async(req,res)=>{
    try {
       const buildings = await Building.find({isDeleted:true}) 
       res.status(200).json({data:buildings})
    } catch (error) {
        res.status(500).json({error: error.message})   
    }
});

// get buildings by landlordId
router.get("/:landlordId", async (req, res) => {
    landlordId = req.params.landlordId
        try {
            const buildings = await Building.find({
                landlordId, isDeleted:false
            }).populate("landlordId")
             res.status(200).json({
                success: true,
                data: { buildings }
            })
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    // get buildings by BranchId
router.get("/:branchId/branch", async (req, res) => {
    branchId = req.params.branchId
        try {
            const buildings = await Building.find({
                branchId, isDeleted:false
            }).populate("branchId")
             res.status(200).json({
                success: true,
                data: { buildings }
            })
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    // Get a building by ID
router.get("/:id/building", async (req, res) => {
    try {
      const buildingId = req.params.id;
      const building = await Building.findById(buildingId)
      .populate("landlordId")
      if (!building) {
        res.status(404).json({ msg: "Building not found", code: 404 });
      } else {
        res.status(200).json(building);
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

// Get archived buildings
router.get("/", async (req, res) => {
  try {
    const archiveBuilding = await Building.find({ isDeleted: true });

    res.status(200).json(archiveBuilding);
  } catch (error) {
 
    res.status(500).json({ error: "Internal server error" });
  }
});

//create buildings

router.post("/", async(req, res)=>{
    const newBuilding = new Building(req.body)
try{
const savedBuilding = await newBuilding.save()
res.status(200).json({data:savedBuilding})
}catch(error){
res.status(500).json({error: error.message})
}
});

// archive a building
router.put("/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findById(id);

    if (!building) {
      return res
        .status(404)
        .json({ message: "The id supplied does not exist", code: 404 });
    }

    building.isDeleted = true; 
    await building.save(); 

    res.status(200).json({ message: "building archived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// unarchive a building
router.put("/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findById(id);

    if (!building) {
      return res
        .status(404)
        .json({ message: "The id supplied does not exist", code: 404 });
    }

    building.isDeleted = false; 
    await building.save(); 

    res.status(200).json({ msg: "building unarchived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update a building
router.put("/updateBuilding/:id", async (req, res) => {
  const buildingId = req.params.id;

  try {
      const updatedBuilding = await Building.findByIdAndUpdate(buildingId, {
          $set: req.body
      }, { new: true });
      res.status(200).json({
          success: true,
          message: "building Updated successfully",
          data: updatedBuilding
      })
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "cannot update building"
      })
  }
});

//delete a building
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBuilding = await Building.findById(id);

    if (!deleteBuilding) {
      res.status(404).json({ message: "Building not found", code: 404 });
    } else {
    
      await deleteBuilding.deleteOne();

      res.status(200).json({ message: "Building deleted successfully", code: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router