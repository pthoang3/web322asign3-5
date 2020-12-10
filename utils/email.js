require("dotenv").config({path:'./config/keys.env'});
var nodemailer = require("nodemailer");

const sendEmail = user => {
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
});
var myUser={
    user_fname:'',
    user_lname:'',
    user_email:'',
    username:''
}
const FORM_DATA = user;
myUser.user_fname=FORM_DATA.firstname;
myUser.user_lname=FORM_DATA.lastname;
myUser.user_email=FORM_DATA.email;
myUser.username=myUser.user_firstname+ ' '+ myUser.user_lastname;
var emailOptions = {
    from: 'pthoang3web322@gmail.com',
    to: FORM_DATA.email,
    subject: 'Register Confirmation from PTH Airbnb',
    html: '<p>Dear '+ `${user.lastname}` +',<br>'+
    '&nbsp;&nbsp;&nbsp;&nbsp;You have successfully register to PTHHouseTO website. <br>'+
    '&nbsp;&nbsp;&nbsp;&nbsp;Thank you for choosing us to find your ideal house. We are happy that we will be with you in your next travel.'
  +'</p>'+
  '<p>'+
  'Best regards,<br>'+
  'PTHHouseTo'+
  '</p>'
};

transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
        console.log("ERROR: " + error);
    } else {
        console.log("SUCCESS: " + info.response);
        
    }
});
  
};

module.exports = sendEmail;
