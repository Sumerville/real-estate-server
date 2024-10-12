const nodemailer = require("nodemailer");
const pug = require("pug");



module.exports = class Email{
constructor(user, code){
    this.to = user.email;
    this.from = `Sumer Homes <${process.env.EMAIL_FROM}>`;
    this.userName = user.name.split(" ")[0];
    this.code = code;

}

newTransport(){
    return nodemailer.createTransport({
        service:"Gmail",
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    }, 
    });
}

async send(template, subject){
const html = pug.renderFile(

    `${__dirname}/../views/emails/${template}.pug`,
    {
        userName: this.userName,
        code: this.code,
        subject
    }
);

const mailOptions ={
    from: this.from,
    to: this.to,
    subject,
    html: html
};
await this.newTransport().sendMail(mailOptions)
}



}