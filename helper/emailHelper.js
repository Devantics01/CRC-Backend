import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
});

export const sendVerificationMail = async(email, otp_code)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'EMAIL VERIFICATION',
      html: '<p><b>Welcome to Courseware Cloud,<br> The Following is your OTP code</p><br>'+otp_code
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};