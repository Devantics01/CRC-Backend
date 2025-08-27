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

export const sendNewUploadMail = async(email, course_name, course_code)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'NEW COURSE UPLOAD',
      html: `<p><b>Hello there,<br> Their's a new upload for a course in your department!!! <br> Course Name: ${course_name}<br>Course Code: ${course_code}</p><br><p>Login to check it out</p>`
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};

export const sendApprovalMail = async(email, course_name, course_code, lecturer)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'COURSE APPROVAL NEEDED',
      html: `<p><b>Hello there,<br>Their's a new upload for a course in your department!!! <br> Course Name: ${course_name}<br>Course Code: ${course_code}<br>Lecturer: ${lecturer}</p><br><p>Login to Approve it</p>`
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};

export const sendApprovedMail = async(email, course_name, course_code)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'NEW COURSE UPLOAD APPROVED',
      html: `<p><b>Hello there,<br>The new upload for the following course:<br> Course Name: ${course_name}<br>Course Code: ${course_code}<br>has been approved by the Head of department</p><br><p>Login to check it out now.</p>`
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};

export const sendNewLecturerMail = async(email, lecturer_name)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'NEW LECTURER IN YOUR DEPARTMENT',
      html: `<p><b>Hello there,<br> A new Lecturer has been registered under your department!!! <br> Lecturer Name: ${lecturer_name}<br><p>Login to approve</p>`
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};

export const sendApprovedLecturerMail = async(email, department)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'REGISTRATION APPROVED',
      html: `<p><b>Hello there,<br> Your request to be a lecturer under the department of ${department} has been approved by the HOD<br><p>Login to start uploading.</p>`
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};

export const sendRejectedLecturerMail = async(email, department)=>{
  try{
    await transporter.sendMail({
      from: 'CourseWare Cloud',
      to: email,
      subject: 'REGISTRATION REJECTED',
      html: `<p><b>Hello there,<br> Your request to be a lecturer under the department of ${department} has been rejected by the HOD<br><p>Login to re-apply. IF you don't get approved in 3 days, your account will be deleted..</p>`
    })
    return true;
  } catch(err){
    console.log(err);
    return {error: 'email sending failed'+err}
  };
};