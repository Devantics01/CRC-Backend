import express from 'express';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../config/token.js';
import {createLecturer, findLecturer, getLecturerPayload, getLecturerInfo, updateLecturerInfo, updateLecturerAcctStatus, deleteLecturer } from '../controller/lecturerController.js';
import { sendVerificationMail } from '../helper/emailHelper.js';
import { generateOtp } from '../helper/otpGenerator.js';
import { authenticateToken, authorizeLecturer } from '../middleware/authMiddleware.js';
import { confirmOTP, deleteOTP } from '../controller/otpController.js';

const router = express.Router();

router.post('/new', async(req, res)=>{
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        const createdLecturer = await createLecturer({
            username: req.body.username,
	        program: req.body.program,
            email: req.body.email,
            faculty: req.body.faculty,
            password: hashedPassword,
            department: req.body.department,
            levelsTaught: req.body.levelsTaught,
            staffID: req.body.staffID
        });
        if (createdLecturer == true) {
            const otpCode = await generateOtp(req.body.email);
            setTimeout(async()=>{const deleted = await deleteOTP({otp_code: otpCode})}, 60000);
            console.log(otpCode);
            const sentMail = sendVerificationMail(req.body.email, otpCode);
            if (sentMail == true) {
                res.json({msg: 'success'}).sendStatus(201);
            } else {
                res.json({msg: 'failed', err: sentMail.error});
            }
        } else {
            res.json({msg: 'failed', err: createdLecturer.error})
        };
    } catch (error) {
        res.json({msg: 'failed', err: error});
    }
})

router.post('/verify', async(req, res)=>{
    try {
        const confirmedOtp = await confirmOTP({otp_code: req.body.otp_code});
        if (confirmedOtp.status == true) {
            await updateLecturerAcctStatus({email: confirmedOtp.email, acctStatus: 'approved'});
            const payload = await getLecturerPayload({email: confirmedOtp.email});
            if (payload.error) {
                res.json({msg: 'cannot get token payload', err: payload.error}).sendStatus(500);
            } else {
                const token = await generateToken(payload);
                if (token.error) {
                    res.json({msg: 'unable to generate token', err: token.err});
                } else {
                    res.json({
                        msg: 'success',
                        access_token: token.accessToken,
                        refresh_token: token.refreshToken
                    });
                };
            };
        } else {
            res.json({
                msg: 'failed to verify',
                err: 'invalid OTP'
            });
        }
    } catch (error) {
        res.json({
            msg: 'failed to verify',
            err: error
        })
    };
});

router.post('/login', async (req, res)=>{
    try {
        const foundLecturer = await findLecturer({
            email: req.body.email,
            password: req.body.password
        })
        if (foundLecturer == true) {
            const payload = await getLecturerPayload({email: req.body.email});
            if (payload.error) {
                res.json({msg: 'cannot get token payload', err: payload.error}).sendStatus(500);
            } else {
                const token = await generateToken(payload);
                if (token.error) {
                    res.json({msg: 'unable to generate token', err: token.err});
                } else {
                    res.json({
                        msg: 'success',
                        access_token: token.accessToken,
                        refresh_token: token.refreshToken
                    });
                };
            };
        } else {
            res.json({msg: 'login attempt failed', err: foundLecturer.msg}).sendStatus(500);
        }
    } catch (error) {
        res.json({msg: 'login attempt failed', err: error})
    }
})

router.get('/profile', [authenticateToken, authorizeLecturer], async (req, res)=>{
    try {
        const lecturerProfile = await getLecturerInfo({
            email: req.user.email,
        })
        if (lecturerProfile.error) {
            res.json({
                msg: 'failed',
                err: lecturerProfile.error
            })
        } else {
            res.json({
                msg: 'success',
                profileInfo: lecturerProfile
            })
        }
    } catch (error) {
        
    }
});

router.put('/update', [authenticateToken, authorizeLecturer], async (req, res)=>{
    try {
        const updated = await updateLecturerInfo({
            email: req.user.email,
            department: req.body.department,
            faculty: req.body.faculty,
            levelsTaught: req.body.levelsTaught,
            assignedCourses: req.body.assignedCourses
        })
        if (updated == true) {
            res.json({msg: 'profile updated successfully'});
        } else {
            res.json({msg: 'update failed successfully'});
        }
    } catch (error) {
        res.json({msg: 'error', err: error});
    }
})

router.delete('/delete', [authenticateToken, authorizeLecturer], async (req, res)=>{
    try {
        const deleted = await deleteLecturer({
            email: req.user.email
        });
        if (deleted == true) {
            res.json({msg: 'account deleted successfully'});
        } else {
            res.json({msg: 'deletion failed successfully'});
        }
    } catch (error) {
        res.json({msg: 'error', err: error});
    }
})

export default router;