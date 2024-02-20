const router = require("express").Router();
const TenantMsg = require("../models/tenantmsgModel")


// get messages by landlord

router.get("/msg/:landlordId", async (req, res) => {
    let landlordId = req.params.landlordId;
    try {
       let posts;
       if (landlordId) {
          posts = await TenantMsg.find( {landlordId} ).populate("landlordId")
          res.status(201).json(posts)
       } else { res.status(404).json("User post not found") }
    } catch (error) {
       res.status(500).json(error)
    }
 });


// get tenant messages by tenant id

    router.get("/:tenantId/msg", async (req, res) => {
        let tenantId = req.params.tenantId;
        try {
           let posts;
           if (tenantId) {
              posts = await TenantMsg.find( {tenantId} ).populate("tenantId")
              res.status(201).json(posts)
           } else { res.status(404).json("User post not found") }
        } catch (error) {
           res.status(500).json(error)
        }
     });


// get tenant message by message id i.e get single message
router.get("/msg/:id", async (req, res) => {

    let Msg;
    try {
       Msg = await TenantMsg.findById(req.params.id);
    } catch (error) {
       console.log(error)
    }
    if (!Msg) {
       return res.status(400).json("No Message found")
    }
    return res.status(200).json(Msg)
 });

// get messages by branch 1

router.get("/:branchId", async (req, res) => {
    let branchId = req.params.branchId;
    try {
       let posts;
       if (branchId) {
          posts = await TenantMsg.find( {branchId} ).populate("tenantId")
          res.status(201).json(posts)
       } else { res.status(404).json("User post not found")}
    } catch (error) {
       res.status(500).json(error)
    }
 });

 // Get archived messages
router.get("/", async (req, res) => {
   try {
     const archiveBranch = await TenantMsg.find({ isDeleted: true });
 
     res.status(200).json(archiveBranch);
   } catch (error) {
  
     res.status(500).json({ error: "Internal server error" });
   }
 });

// send message to tenant
router.post("/message", async (req, res) => {
    const message = req.body;
    const newMessage = new TenantMsg(message);
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
        const updatedMessage = await TenantMsg.findByIdAndUpdate(messageId, {
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
     const msg = await TenantMsg.findById(id);
 
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
     const msg = await TenantMsg.findById(id);
 
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
     const deletedMessage = await TenantMsg.findById(id);
 
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