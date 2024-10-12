const router = require("express").Router();
const Building = require("../models/buildingModel");
const { upload, handleUpload } = require("../utils/cloudinaryUpload");

//get building by propertyType, city and buildingCategory
router.get("/", async(req,res)=>{
  try {
    let buildings =[];
    const {propertyType,buildingCategory, situated,title } = req.query;
    if(propertyType){
      buildings = await Building.find({propertyType})
    }
   if(buildingCategory){
      buildings = await Building.find({buildingCategory})
    }
   if(situated){
      buildings = await Building.find({situated})
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
    let buildings =[];
      buildings = await Building.find({isDeleted:false})
     .populate("landlordId branchId").select("-password") 
     res.status(200).json(buildings)
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
// }
// get buildings without archived ones

router.get("/archived", async(req,res)=>{
    try {
       const buildings = await Building.find({isDeleted:true}) 
       res.status(200).json({data:buildings})
    } catch (error) {
        res.status(500).json({error: error.message})   
    }
});

// get featured buildings 

router.get("/featured", async(req,res)=>{
  try {
     const buildings = await Building.find({isFeatured:true})
     .populate("landlordId branchId flatId").select("-password") 
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
            }).populate("landlordId branchId")
             res.status(200).json(buildings)
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
             res.status(200).json(buildings)
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    // Get a building by ID
router.get("/:id/building", async (req, res) => {
    try {
      const buildingId = req.params.id;
      const building = await Building.findById(buildingId)
      .populate("branchId")
      if (!building) {
        res.status(404).json({ msg: "Building not found", code: 404 });
      } else {
        res.status(200).json(building);
      }
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

// Get all archived buildings
router.get("/", async (req, res) => {
  try {
    const archiveBuilding = await Building.find({ isDeleted: true });

    res.status(200).json(archiveBuilding);
  } catch (error) {
 
    res.status(500).json({ error: "Internal server error" });
  }
});

// get archived buildings by landlordId
router.get("/:landlordId/archives", async (req, res) => {
  landlordId = req.params.landlordId
      try {
          const buildings = await Building.find({
              landlordId, isDeleted:true
          }).populate("branchId").select("-password")
           res.status(200).json(buildings)
      } catch (error) {
        res.status(500).json({ error: error.message });
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

//create buildings with coudinary upload

router.put("/:id/upload", upload.single("pix"), async(req, res)=>{
try {
  const { id } = req.params;
  const building = await Building.findById(id);

  if (!building) {
    return res
      .status(404)
      .json({ msg: "Building with this id does not exist", code: 404 });
  }

  if (req.file) {
    const base64Converter = Buffer.from(req.file.buffer).toString("base64");
    let dataURL = "data:" + req.file.mimetype + ";base64," + base64Converter;
    const data = await handleUpload(dataURL);

    building.pix = data.url;
    await building.save();
    res.status(200).json({
      success: true,
      msg: "Building created"}); 
  }else {
    res.json({
      msg: "building cannot be saved without an image",
      code: 400,
    });
  }

} catch (error) {
  res.status(500).json({error: error.message}) 
}
})

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
//update a building by id
router.put("/updateone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findById(id);

    if (!building)
      return res
        .status(404)
        .json({ msg: "The id supplied does not exist", code: 404 });

    let data = building._doc;
    building.overwrite({...data, ...req.body });
    building.save();

    res.send({ msg: "branch updated", data: building });
  } catch (err) {
    res.status(500).json({ error: err.message });
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