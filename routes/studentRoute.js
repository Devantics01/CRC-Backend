import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { confirmToken } from '../controller/tokenController.js';
import { generateToken } from '../config/token.js';
import {
        createStudent, findStudent, registerCourse,
        getStudentPayload, getStudentInfo, updateStudentInfo,
        updateStudentAcctStatus, deleteStudent, getBookmark,
        addCourseToBookmark, deleteCourseFromBookmark
    } from '../controller/studentController.js';
import { sendVerificationMail } from '../helper/emailHelper.js';
import { generateOtp, generateEventID } from '../helper/otpGenerator.js';
import { confirmOTP, deleteOTP } from '../controller/otpController.js';
import { authenticateToken, authorizeStudent, authorizeAccStatus } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/new', async(req, res)=>{
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        const createdStudent = await createStudent({
            username: req.body.username,
            email: req.body.email,
            level: req.body.level,
            password: hashedPassword,
            department: req.body.department,
            matricNumber: req.body.matricNumber
        });
        if (createdStudent == true) {
            const otpCode = await generateOtp(req.body.email);
            console.log(otpCode);
            setTimeout(async()=>{const deleted = await deleteOTP({otp_code: otpCode})}, 300000);
            const sentMail = await sendVerificationMail(req.body.email, otpCode);
            console.log(sentMail);
            if (sentMail == true) {
                res.json({msg: 'success', info: 'OTP sent to mail'});
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
        });
        if (foundStudent == true) {
            const payload = await getStudentPayload({email: req.body.email});
            if (payload.error) {
                res.json({msg: 'cannot get token payload', err: payload.error});
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
            res.json({msg: 'login attempt failed', err: foundStudent.msg});
        }
    } catch (error) {
        res.json({msg: 'login attempt failed', err: error.msg})
    }
})

router.get('/profile', [authenticateToken, authorizeAccStatus, authorizeStudent], async (req, res)=>{
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

router.put('/register-course', [authenticateToken, authorizeAccStatus, authorizeStudent], async(req, res)=>{
    try {
        const registered = await registerCourse({
            email: req.user.email,
            registeredCourses: req.body.registeredCourses
        });
        if (registered == true) {
            res.json({
                msg: 'course registered successfully'
            });
        } else {
            res.json({
                msg: 'failed',
                error: registered
            });
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    }
})

router.put('/update', [authenticateToken, authorizeAccStatus, authorizeStudent], async (req, res)=>{
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
        console.log(error);
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
                role: user.role
            };
            const newToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 600});
            res.json({msg:'success', token: newToken});
            });
        } else {
            console.log(confirmedToken);
            res.json({msg:'unregistered token', err: confirmedToken})
        }
    } catch (err) {
        console.log(err);
        res.json({msg:'unable to renew token', error: err});
    }
});

router.put('/add-bookmark', [authenticateToken, authorizeAccStatus, authorizeStudent], async (req, res) => {
    try {
        const added = await addCourseToBookmark({
            email: req.user.email,
            course: {
                course_name: req.body.course_name,
                course_code: req.body.course_code,
            }
        });
        if (added == true) {
            res.json({
                msg: 'success'
            });
        } else {
            res.json({
                msg: 'failed'
            })
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.message
        })
    }
});


router.get('/get-bookmark', [authenticateToken, authorizeAccStatus, authorizeStudent], async (req, res) => {
    try {
        const info = await getBookmark(req.user.email);
        res.json({
            msg: 'success',
            bookmark: info
        })
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.message
        })
    }
});


router.put('/remove-bookmark', [authenticateToken, authorizeAccStatus, authorizeStudent], async (req, res) => {
    try {
        const deleted = await deleteCourseFromBookmark({
            email: req.user.email,
            course_code: req.body.course_code
        })
        if (deleted == true) {
            res.json({
                msg: 'success'
            })
        } else {
            res.json({
                msg: 'failed'
            })
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.message
        });
    }
});


export default router;
