import Mailjet from "node-mailjet";
import dotenv from 'dotenv';

dotenv.config();

const transporter = Mailjet.apiConnect(
  process.env.PUB_KEY,
  process.env.PRI_KEY
)

export const sendVerificationMail = async(email, otp_code)=>{
  try{
    const request = await transporter.post('send', {version: 'v3.1'}).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL,
            Name: 'CourseWare - Cloud'
          },
          To: [
            {
              Email: email,
              Name: 'You'
            },
          ],
          Subject: 'Email Verification',
          TextPart: 'Welcome to CourseWare Cloud',
          HTMLPart: `<p>Your Email Verification Code is:<b> ${otp_code}</b></p>`
        },
      ],
    });
    const response = await request;
    if (response.response.status === 200) {
      console.log('success');
      return true;
    } else {
      return {error: 'failed to send email'}
    }
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};


