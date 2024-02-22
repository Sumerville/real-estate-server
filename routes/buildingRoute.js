const router = require("express").Router();
const Building = require("../models/buildingModel");
// get all hotels

router.get("/", async(req,res)=>{
    try {
       const buildings = await Building.find() 
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

module.exports = router