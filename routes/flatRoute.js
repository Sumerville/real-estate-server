const router = require("express").Router();
const Flat = require("../models/flatModel");

// get all flats
router.get("/", async (req, res) => {
  try {
    const flats = await Flat.find()
    res.status(200).json({ data: flats })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// get avaiable flats by buildingId

router.get("/:buildingId", async (req, res) => {
  buildingId = req.params.buildingId
  try {
    const flats = await Flat.find({
      buildingId
    })
    res.status(200).json({
      success: true,
      data: flats,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get a flat by owner

router.get("/:owner", async (req, res) => {
  owner = req.params.owner
  try {
    const flats = await Flat.find({
      owner
    })
    res.status(200).json({
      success: true,
      data: flats,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get avaiable flats by buildingId

router.get("/:buildingId/available", async (req, res) => {
  buildingId = req.params.buildingId
  try {
    const flats = await Flat.find({
      buildingId, isAvailable: true
    })
    res.status(200).json({
      success: true,
      data: flats, 
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }   
}); 

// get unavaiable flats by buildingId
router.get("/:buildingId/unavailable", async (req, res) => {
  buildingId = req.params.buildingId
  try {
    const flats = await Flat.find({
      buildingId, isAvailable: false
    })
    res.status(200).json({
      success: true,
      data: flats,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// register Flat
router.post("/", async (req, res) => {
  try {
    const flat = new Flat(req.body);
    await flat.save();
    res.status(200).json({
      success: true,
      message: "flat Created Successfully",
      data:flat
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
});

//delete a flat
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFlat = await Flat.findById(id);

    if (!deleteFlat) {
      res.status(404).json({ message: "Flat not found", code: 404 });
    } else {

      await deleteFlat.deleteOne();

      res.status(200).json({ message: "Flat deleted successfully", code: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update Flat
router.put("/:id", async (req, res) => {
  try {
    const updatedFlat = await Flat.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedFlat)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// Renting a flat
// router.put("/:id/rent", async(req, res)=>{

//   const id = req.params.id;
//   const {userId} = req.body;

//   try{
// const post = await Flat.findById(id);
// if(!post.ownerId.includes(userId)){

//   await post.updateOne({$push:{ownerId: userId}});
//   res.status(200).json("Flat rented")
// }else{

//   await post.updateOne({$pull:{ownerId: userId}});
//   res.status(200).json("Flat Not Rented")
// }
// post.isAvailable = false;
// await post.save(); 
//   }catch(err){
//   }
// });

// Renting a flat
router.put("/:id/rent", async (req, res) => {

  try {
    const post = await Flat.findById(req.params.id);

    if (!post.owner.includes(req.body.userId)) {
      await post.updateOne({ $push: { owner: req.body.userId } });
      res.status(200).json("Flat Rented")
    }
    post.isAvailable = false;
    await post.save();

  } catch (error) {
    res.status(500).json(error)
  }
});
// rent flat without pushing id
router.put("/:id/newrent", async (req, res) => {

  try {
    const post = await Flat.findById(req.params.id);
    post.isAvailable = false;
    await post.save();
    res.status(200).json("Flat Rented")
  } catch (error) {
    res.status(500).json(error)
  }
});

// Cancel Renting 
router.put("/:id/unrent", async (req, res) => {

  try {
    const post = await Flat.findById(req.params.id);

    if (post.owner.includes(req.body.userId)) {
      await post.updateOne({ $pull: { owner: req.body.userId } });
      res.status(200).json("Flat not Rented")
    }
    post.isAvailable = true; 
    await post.save();

  } catch (error) {
    res.status(500).json(error) 
  }
});

module.exports = router