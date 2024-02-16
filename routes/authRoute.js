const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register new user
router.post("/register", async (req, res) => {
    try {
        // check if user exist
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            // throw new error("User Already Exist")
            return res.status(404).json({
                message:"User Already Exist"
            })
        }
        // hassh password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
        // save user
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User Created Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

// user login
router.post("/login", async (req, res) => {
    try {
        // check if user exist
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // throw new error("User Not Found");
            return res.status(404).json({
                message:"User Not Found"
            
            })
         
        }
        
        // compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            // throw new error("Invalid Password");
            return res.status(404).json({
                message:"Invalid Password"
            })
        }

        // generate and assign token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY,{
            expiresIn:"15d"
        })
        const {password,...rest} = user._doc;
        // send response
        res.status(200).json({
            success: true,
            message: "User loged in successfully",
            token,
            data: {...rest}
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

module.exports = router;