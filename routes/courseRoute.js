import express from 'express';
import { authenticateToken, authorizeHOD, authorizeLecturer, checkHODApproval, authorizeUser } from '../middleware/authMiddleware.js';
import { uploadDoc } from '../helper/upload.js';
import path from 'path';
import { createCourse, getCourse, getCourseInBulk, updateCourseMaterial, updateCourseAssignment, updateCourseInfo, updateCourseResources, approveCourseMaterial, deleteCourse } from '../controller/courseController.js';

const router = express.Router();

router.post('/new', [authenticateToken, authorizeHOD], async(req,res)=>{
    try {
        const courseCreated = await createCourse(
            {
                course_name: req.body.course_name,
                course_code: req.body.course_code,
                department: req.user.department,
                level: req.body.level,
                course_description: req.body.course_description,
            }
        );
        console.log(courseCreated);
        if (courseCreated == true) {
            res.json({msg: "course created successfully"});
        } else {
            res.json({
                msg: "failed",
                err: courseCreated.error
            })
        }
    } catch (err) {
        res.json({
            msg: "error",
            error: err
        });
    }
});

router.put('/upload', [authenticateToken, authorizeLecturer, checkHODApproval, uploadDoc], async(req, res)=>{
    try {
        const fileLinks = req.files.map(file => {
        const relativePath = `/uploads/${file.filename}`;
        return relativePath;
        });
        const courseUploaded = await updateCourseMaterial({
            course_code: req.body.course_code,
            course_name: req.body.course_name,
            resource_link: fileLinks,
            assignment: req.body.assignment
        });
        if (courseUploaded == true) {
            res.json({msg: "upload successful"});
        } else {
            res.json({
                msg:"task failed",
                error: courseUploaded.error 
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            msg: "error",
            error: err
        })
    }
});

router.get('/view', [authenticateToken, authorizeUser], async(req, res)=>{
    try {
        const courseProfile = await getCourse({
            course_name: req.query.course_name,
            course_code: req.query.code
        });
        if (courseProfile.course_name) {
            res.json({
                msg: 'course retrieved successfully',
                courseInfo: courseProfile
            })
        } else {
            res.json({
                msg: 'retrieval failed',
                error: courseProfile
            });
        }
    } catch (err) {
        res.json({
            msg: 'failed',
            error: err
        });
    };
});


router.put('/update-file-resource', [authenticateToken, authorizeLecturer, uploadDoc], async(req, res)=>{
    try {
        const updated = await updateCourseResources({
            course_code: req.body.course_code,
            resource_link: `/uploads/course/${req.file.filename}`
        });
        if (updated == true) {
            res.json({
                msg: 'file updated successfully'
            });
        } else {
            res.json({
                msg: 'file update failed',
                error: updated.error
            });
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    };
});

router.put('/update-assignment', [authenticateToken, authorizeLecturer], async(req, res)=>{
    try {
        const updated = await updateCourseAssignment({
            course_code: req.body.course_code,
            assignment: req.body.assignment
        });
        if (updated == true) {
            res.json({
                msg: 'assignmnent updated successfully'
            });
        } else {
            res.json({
                msg: 'assignment update failed',
                error: updated.error
            });
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    };
});

router.put('/update-course-info', [authenticateToken, authorizeHOD], async(req, res)=>{
    try {
        const updated = await updateCourseInfo({
            course_code: req.body.course_code,
            newCourseCode: req.body.newCode,
            newCourseName: req.body.newCourseName,
            newCourseDescription: req.body.newCourseDescription
        });
        if (updated == true) {
            res.json({
                msg: 'course updated successfully'
            });
        } else {
            res.json({
                msg: 'course update failed',
                error: updated.error
            });
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err
        });
    };
});

router.put('/approve', [authenticateToken, authorizeHOD], async(req, res)=>{
    try {
        const approved = await approveCourseMaterial({
            course_code: req.body.course_code
        });
        if (approved == true) {
            res.json({
                msg: 'course approved successfully',
            })
        } else {
            res.json({
                msg: 'course approval failed',
                error: approved.error
            });
        }
    } catch (error) {
        res.json({
            msg: 'error',
            error: err
        });
    }
});


router.delete('/delete', [authenticateToken, authorizeHOD], async(req, res)=>{
    try {
        const deleted = await deleteCourse({
            course_code: req.body.course_code
        });
        if (deleted == true) {
            res.json({
                msg: 'course deleted successfully',
            })
        } else {
            res.json({
                msg: 'course deletion failed',
                error: approved.error
            });
        }
    } catch (error) {
        res.json({
            msg: 'error',
            error: err
        });
    }
});

export default router;
