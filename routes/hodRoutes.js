import express from 'express';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../config/token.js';
import {createHOD, findHOD, getHODPayload, getHODInfo, updateHODInfo, updateHODAcctStatus, deleteHOD } from '../controller/hodController.js';
import { sendVerificationMail } from '../helper/emailHelper.js';
import { generateOtp } from '../helper/otpGenerator.js';
import { confirmOTP, deleteOTP } from '../controller/otpController.js';
import { authenticateToken, authorizeHOD } from '../middleware/authMiddleware.js';
import { getLecturersByDepartment } from '../controller/lecturerController.js';
import { getStudentCount } from '../controller/studentController.js';


const router = express.Router();

router.post('/new', async(req, res)=>{
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        const createdHOD = await createHOD({
            username: req.body.username,
            email: req.body.email,
            faculty: req.body.faculty,
            password: hashedPassword,
            department: req.body.department,
            academicYear: req.body.academicYear
        });
        if (createdHOD == true) {
            const otpCode = await generateOtp(req.body.email);
            console.log(otpCode);
            setTimeout(async()=>{const deleted = await deleteOTP({otp_code: otpCode})}, 300000);
            const sentMail = await sendVerificationMail(req.body.email, otpCode);
            if (sentMail == true) {
                res.json({msg: 'success', info: 'OTP sent to mail'}).sendStatus(201);
            } else {
                res.json({msg: 'failed', err: sentMail.error});
            }
        } else {
            res.json({msg: 'failed', err: createdHOD.error})
        };
    } catch (error) {
        res.json({msg: 'failed', err: error});
    };
});

router.post('/verify', async(req, res)=>{
    try {
        const confirmedOtp = await confirmOTP({otp_code: req.body.otp_code});
        if (confirmedOtp.status == true) {
            await updateHODAcctStatus({email: confirmedOtp.email, acctStatus: 'approved'});
            const payload = await getHODPayload({email: confirmedOtp.email});
            if (payload.error) {
                res.json({msg: 'cannot get token payload', err: payload.error}).sendStatus(500);
            } else {
                const token = await generateToken(payload);
                if (token.error) {
                    res.json({msg: 'unable to generate token', err: token.err});
                } else {
                    res.json({
                        msg: 'email verified',
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
        const foundHOD = await findHOD({
            email: req.body.email,
            password: req.body.password
        })
        if (foundHOD == true) {
            const payload = await getHODPayload({email: req.body.email});
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
            res.json({msg: 'login attempt failed', err: foundHOD.msg}).sendStatus(500);
        }
    } catch (error) {
        res.json({msg: 'login attempt failed', err: error})
    }
})

router.get('/profile', [authenticateToken, authorizeHOD], async (req, res)=>{
    try {
        const hODProfile = await getHODInfo({
            email: req.user.email
        })
        if (hODProfile.error) {
            res.json({
                msg: 'failed',
                err: hODProfile.error
            })
        } else {
            res.json({
                msg: 'success',
                profileInfo: hODProfile
            })
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    }
});

router.get('/lecturers', [authenticateToken, authorizeHOD], async(req, res)=>{
    try {
        const lecturers = await getLecturersByDepartment({
            department: req.user.department
        });
        if (lecturers.status == true) {
            res.json({
                msg: 'success',
                lecturers: lecturers.list
            });
        } else {
            res.json({
                msg: 'failed',
                err: lecturers.error
            });
        };
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    }
});

router.get('/studentCount', [authenticateToken, authorizeHOD], async(req, res)=>{
    try {
        const count = await getStudentCount({
            department: req.user.department
        });
        if (count.status == true) {
            res.json({
                msg: 'success',
                noOfstudent: count.value
            });
        } else {
            res.json({
                msg: 'failed',
                err: count.error
            });
        };
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    }
});


router.put('/update', [authenticateToken, authorizeHOD], async (req, res)=>{
    try {
        const updated = await updateHODInfo({
            email: req.user.email,
            academicYear: req.body.academicYear
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


router.delete('/delete', [authenticateToken, authorizeHOD], async (req, res)=>{
    try {
        const deleted = await deleteHOD({
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