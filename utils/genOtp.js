
const generateOtp = async()=>{
    try {

        return (otp = `${Math.floor(100000 + Math.random() *900000)}`)   
    } catch (err) {
        res.status(500).json({ err: err.message });   
    }
};

module.exports = generateOtp