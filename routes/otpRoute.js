import express from 'express';
import { generateOtp } from '../helper/otpGenerator.js';
import { sendVerificationMail } from '../helper/emailHelper.js';

const router = express.Router();

router.post('/new', async(req, res)=>{
    try {
        const otpCode = await generateOtp(req.body.email);
        setTimeout(async()=>{
            const deleted = await deleteOTP({otp_code: otpCode})}, 300000);
        const sentMail = sendVerificationMail(req.body.email, otpCode);
        if (sentMail == true) {
            res.json({msg: 'success'}).sendStatus(201);
        } else {
            res.json({msg: 'failed', err: sentMail.error});
        };
    } catch (err) {
        res.json({msg: 'failed', error: err});
    }
})

export default router;