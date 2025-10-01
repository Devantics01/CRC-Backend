import express from 'express';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../config/token.js';
import { confirmToken } from '../controller/tokenController.js';
import {createLecturer, findLecturer, getLecturerPayload, getLecturerInfo, updateLecturerInfo, updateHODApproval, updateLecturerAcctStatus, deleteLecturer } from '../controller/lecturerController.js';
import { sendVerificationMail } from '../helper/emailHelper.js';
import { generateOtp } from '../helper/otpGenerator.js';
import { authenticateToken, authorizeHOD, authorizeLecturer } from '../middleware/authMiddleware.js';
import { confirmOTP, deleteOTP } from '../controller/otpController.js';
import { info } from 'console';

const router = express.Router();

router.post('/new', async(req, res)=>{
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        const createdLecturer = await createLecturer({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            department: req.body.department,
            levelsTaught: req.body.levelsTaught,
            staffID: req.body.staffID
        });
        if (createdLecturer == true) {
            const otpCode = await generateOtp(req.body.email);
            console.log(otpCode)
            setTimeout(async()=>{const deleted = await deleteOTP({otp_code: otpCode})}, 100000);
            const sentMail = await sendVerificationMail(req.body.email, otpCode);
            if (sentMail == true) {
                res.json({msg: 'success', info: 'OTP sent to Mail'});
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
            levelsTaught: req.body.levelsTaught,
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

router.put('/approve', [authenticateToken, authorizeHOD], async(req, res)=>{
    try {
        const approved = await updateHODApproval({
            email: req.body.email
        });
        if (approved == true) {
            res.json({
                msg: 'success'
        });
        } else {
            res.json({
                msg: 'failed',
                error: approved
            });
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
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
});

router.post('/renew-token', async(req, res)=>{
    try {
        const confirmedToken = await confirmToken({refreshToken: req.body.refreshToken});
        if (confirmedToken == true) {
            jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
            if(err) return res.sendStatus(401);
            req.user = {
                username: user.username,
                email: user.email,
                department: user.department,
                acctStatus: user.acctStatus,
                hoApproval: user.hoApproval,
                role: user.role
            };
            const newToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 600});
            res.json({msg:'success', token: newToken});
            });
        } else {
            res.json({msg:'unregistered token', err: confirmedToken})
        }
    } catch (err) {
        res.json({msg:'unable to renew token', error: err});
    }
});

export default router;
