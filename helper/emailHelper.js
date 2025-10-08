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


export const sendLecturerAssignmentMail = async(hodEmail, email, course_code, course_name)=>{
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
          Subject: 'Course Assignmnet',
          TextPart: `Hey there, The HOD of your department @ ${hodEmail} has assigned the following course to you!`,
          HTMLPart: `<p>${course_code}<b> ${course_name}</b></p>`
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


export const sendHODApprovalMail = async(email, hodEmail)=>{
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
          Subject: 'HOD Approval',
          TextPart: `Hey there, The HOD of your department @ ${hodEmail} has approved your lecturer account!`,
          HTMLPart: `<p>You can now start uploading courses and filling the world with your amazing Knowledge ;)</p>`
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


export const sendLecturerResgistrationMail = async(email, hodEmail)=>{
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
              Email: hodEmail,
              Name: 'You'
            },
          ],
          Subject: 'New Lecturer Alert !!!',
          TextPart: 'Hey there, a New Lecturer @ ${email} has registered an account under your department!',
          HTMLPart: `<p>Login to verify and approve the account!</p>`
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



