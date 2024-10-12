const nodemailer = require("nodemailer");
const pug = require("pug");



const transporter = nodemailer.createTransport({
  service:"Gmail",
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Summer Homes 👻" <acadsumerville@gmail.com>', // sender address
      to: "uwaaustin10@gmail.com, acadsumerville@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world? ", // plain text body
      html: "<b>Hello! Checking if email is working with port and host</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
    // main().catch(console.error); 


    router.post("/register", async(req, res)=>{
      const {userName, email, password, address} =req.body;
        try {
      // check if landlord exist
          const landlord = await Landlord.findOne({email: req.body.email})
          if (landlord) {
            // throw new error("User Already Exist")
            return res.status(404).json({
                message:"Landlord Already Exist"
            })
        }
        const otp = Math.floor(100000 + Math.random() *900000)
            const admin = new Landlord({
              userName: userName,
              password: password,
              email: email,
              address: address,
              otp: otp
            });
            const mailOptions ={
              from: '"Summer Homes 👻" <acadsumerville@gmail.com>',
              to:email,
              subject:"Otp fro registration",
              html:`<div>
              <p> Hi ${userName} </p>
              <p> This is your code ${otp} </p>
              </div>`
            }
            
            transporter.sendMail(mailOptions,(err,succses)=>{
              if(err){
                console.log(err)
              }else{
                return res.status(200).json({message:"otp sent"})
              }
            })
             await admin.save();
             let payload ={};
             payload.email = admin.email;
             payload.name = admin.userName;
             payload.code = admin.password;
             payload.verificationCode = admin.otp;
             res.status(200).json({
                success:true,
                message:"Landlord Created Successfully"
             }) 
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            }) 
        }
    });