import { deleteOTP, registerOTP } from "../controller/otpController.js";
import cron from 'node-cron';

const generateOtpCode = ()=>{
    const characters ='0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const generateOtp = async(email)=>{
    const code = generateOtpCode();
    try {
        const registeredOTP = await registerOTP({email: email, otp_code: code});
        if (registeredOTP == true) {
            return code;
        };
    } catch (err) {
        console.log( err);
    }
}
