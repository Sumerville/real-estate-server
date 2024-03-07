const router = require("express").Router();
const Appartment = require("../models/appartmentModel");
const Building = require("../models/buildingModel");

// get all appartments

router.get("/", async (req, res) => {
  try {
    const appartments = await Appartment.find()
    res.status(200).json({ data: appartments })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// Get an appartment by ID
router.get("/:id", async (req, res) => {
  try {
    const appartmentId = req.params.id;
    const appartment = await Appartment.findById(appartmentId)
    if (!appartment) {
      res.status(404).json({ msg: "Appartment not found", code: 404 });
    } else {
      res.status(200).json(appartment);
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// create appartment
router.post("/:buildingid", async (req, res) => {
  const buildingId = req.params.buildingid;
  const newAppartment = new Appartment(req.body);
  try {
    const savedAppartment = await newAppartment.save();

    try {

      await Building.findByIdAndUpdate(buildingId, {
        $push: { appartment: savedAppartment._id }
      })
    } catch (error) {

    }
    res.status(200).json(savedAppartment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

});
// update appartment
router.put("/:id", async (req, res) => {
  try {
    const updatedAppartment = await Appartment.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedAppartment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

router.delete("/:id/:buildingid", async (req, res) => {
  const buildingId = req.params.buildingid;

  try {
    await Appartment.findByIdAndDelete(req.params.id)

    try {

      await Building.findByIdAndUpdate(buildingId, {
        $pull: { appartment: req.params.id }
      })
    } catch (error) {

    }
    res.status(200).json("Appartment deleted")
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

})

module.exports = router