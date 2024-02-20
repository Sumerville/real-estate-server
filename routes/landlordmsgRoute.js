const router = require("express").Router();
const LanMsg = require("../models/landlordmsgModel")


// get messages by landlord

router.get("/:landlordId/msg", async (req, res) => {
    let landlordId = req.params.landlordId;
    try {
       let posts;
       if (landlordId) {
          posts = await LanMsg.find( {landlordId, isDeleted: false} ).populate("landlordId")
          res.status(201).json(posts)
       } else { res.status(404).json("User post not found") }
    } catch (error) {
       res.status(500).json(error)
    }
 });

// get tenant messages by tenant id

router.get("/msg/:tenantId/", async (req, res) => {
    let tenantId = req.params.tenantId;
    try {
       let posts;
       if (tenantId) {
          posts = await LanMsg.find( {tenantId, isDeleted: false} ).populate("tenantId")
          res.status(201).json(posts)
       } else { res.status(404).json("User post not found") }
    } catch (error) {
       res.status(500).json(error)
    }
 });

 // get messages by branch 1

router.get("/:branchId", async (req, res) => {
    let branchId = req.params.branchId;
    try {
       let posts;
       if (branchId) {
          posts = await LanMsg.find( {branchId, isDeleted: false} ).populate("tenantId")
          res.status(201).json(posts)
       } else { res.status(404).json("User post not found")}
    } catch (error) {
       res.status(500).json(error)
    }
 });

// Get archived messages
router.get("/", async (req, res) => {
    try {
      const archiveBranch = await LanMsg.find({ isDeleted: true });
  
      res.status(200).json(archiveBranch);
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error" });
    }
  });

// send message landlord
router.post("/message", async (req, res) => {
    const message = req.body;
    const newMessage = new LanMsg(message);
    try {
       await newMessage.save();
       
       res.status(201).json(newMessage)
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
 
 });

  //update a message
router.put("/:id/update", async (req, res) => {
    const messageId = req.params.id;
  
    try {
        const updatedMessage = await LanMsg.findByIdAndUpdate(messageId, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            success: true,
            message: "Message Updated successfully",
            data: updatedMessage
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "cannot update message"
        })
    }
  });

// archive a message
router.put("/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      const msg = await LanMsg.findById(id);
  
      if (!msg) {
        return res
          .status(404)
          .json({ message: "The id supplied does not exist", code: 404 });
      }
  
      msg.isDeleted = true; 
      await msg.save(); 
  
      res.status(200).json({ message: "message archived" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// unarchive a message
router.put("/:id/unarchive", async (req, res) => {
    try {
      const { id } = req.params;
      const msg = await LanMsg.findById(id);
  
      if (!msg) {
        return res
          .status(404)
          .json({ message: "The id supplied does not exist", code: 404 });
      }
  
      msg.isDeleted = false; 
      await msg.save(); 
  
      res.status(200).json({ msg: "message unarchived" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//delete a message
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMessage = await LanMsg.findById(id);
  
      if (!deletedMessage) {
        res.status(404).json({ message: "Branch not found", code: 404 });
      } else {
      
        await deletedMessage.deleteOne();
  
        res.status(200).json({ message: "Message deleted successfully", code: 200 });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

 module.exports = router