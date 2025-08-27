import express from 'express';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../config/token.js';
import {createStudent, findStudent, getStudentPayload, getStudentInfo, updateStudentInfo, updateStudentAcctStatus, deleteStudent } from '../controller/studentController.js';
import { sendVerificationMail } from '../helper/emailHelper.js';
import { generateOtp } from '../helper/otpGenerator.js';
import { confirmOTP, deleteOTP } from '../controller/otpController.js';
import { authenticateToken, authorizeStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/new', async(req, res)=>{
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        const createdStudent = await createStudent({
            username: req.body.username,
            email: req.body.email,
            level: req.body.level,
            faculty: req.body.faculty,
            password: hashedPassword,
            department: req.body.department,
            program: req.body.program,
            registeredCourses: req.body.registeredCourses,
            matricNumber: req.body.matricNumber,
            academicYear: req.body.academicYear
        });
        if (createdStudent == true) {
            const otpCode = await generateOtp(req.body.email);
            setTimeout(async()=>{const deleted = await deleteOTP({otp_code: otpCode})}, 60000);
            const sentMail = sendVerificationMail(req.body.email, otpCode);
            if (sentMail == true) {
                res.json({msg: 'success', info: 'OTP sent to mail'}).sendStatus(201);
            } else {
                res.json({msg: 'failed', err: sentMail.error});
            }
        } else {
            res.json({msg: 'failed', err: createdStudent.error})
        };
    } catch (error) {
        res.json({msg: 'failed', err: error});
    };
});

router.post('/verify', async(req, res)=>{
    try {
        const confirmedOtp = await confirmOTP({otp_code: req.body.otp_code});
        if (confirmedOtp.status == true) {
            await updateStudentAcctStatus({email: confirmedOtp.email, acctStatus: 'approved'});
            const payload = await getStudentPayload({email: confirmedOtp.email});
            console.log(payload);
            if (payload.error) {
                res.json({msg: 'cannot get token payload', err: payload.error}).sendStatus(500);
            } else {
                const token = await generateToken(payload);
                console.log(token);
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
        const foundStudent = await findStudent({
            email: req.body.email,
            password: req.body.password
        })
        if (foundStudent == true) {
            const payload = await getStudentPayload({email: req.body.email});
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
            res.json({msg: 'login attempt failed', err: foundStudent.msg}).sendStatus(500);
        }
    } catch (error) {
        res.json({msg: 'login attempt failed', err: error})
    }
})

router.get('/profile', [authenticateToken, authorizeStudent], async (req, res)=>{
    try {
        const studentProfile = await getStudentInfo({
            email: req.user.email
        })
        if (studentProfile.error) {
            res.json({
                msg: 'failed',
                err: studentProfile.error
            })
        } else {
            res.json({
                msg: 'success',
                profileInfo: studentProfile
            })
        }
    } catch (error) {
        res.json({
                msg: 'failed',
                err: error
            })
    }
});

router.put('/update', [authenticateToken, authorizeStudent], async (req, res)=>{
    try {
        const updated = await updateStudentInfo({
            email: req.user.email,
            department: req.body.department,
            program: req.body.program,
            level: req.body.level,
            faculty: req.body.faculty,
            registeredCourses: req.body.registeredCourses,
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

router.delete('/delete', [authenticateToken, authorizeStudent], async (req, res)=>{
    try {
        const deleted = await deleteStudent({
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
