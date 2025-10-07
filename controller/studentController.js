import { where } from "sequelize";
import student from "../model/studentModel.js";
import bcryptjs from "bcryptjs";


export const createStudent = async(data)=>{
    try {
        await student.create({
            username: data.username,
            level: data.level,
            email: data.email,
            password: data.password,
            department: data.department,
            faculty: data.faculty,
            calenderEvents: {
                events:[]
            },
            matricNumber: data.matricNumber,
            acctStatus: 'pending',
            role: 'student'
        })
        return true;
    } catch (err) {
        console.log(err);
        return {error: err};
    }
};

export const findStudent = async(data)=>{
    try {
        const res = await student.findOne({
            where:{
                email: data.email
            }
        });
        if (res == null) {
            return {msg: 'account not found'};
        } else {
            const isMatch = await bcryptjs.compare(data.password, res.dataValues.password);
            if (isMatch == true) {
                if (res.dataValues.acctStatus == 'approved') {
                    return true;
                } else {
                    return {msg: 'unverified account'};
                }
            }
            else {
                return {msg: 'incorrect password'};
            };
        };
    } catch (err) {
        console.log(err);
        return {msg: err};
    }
}

export const registerCourse = async(data)=>{
    try {
        await student.update({
            registeredCourses: data.registeredCourses
        }, {
            where: {
                email: data.email
            }
        });
        return true;
    } catch (err) {
        return err;
    }
}

export const getStudentPayload = async(data)=>{
    try {
        const res = await student.findOne({
            where: {
                email: data.email
            }
        });
        if (res == null) {
            return {error: 'account does not exist'};
        } else {
            return {
                username: res.dataValues.username,
                email: res.dataValues.email,
                department: res.dataValues.department,
                acctStatus: res.dataValues.acctStatus,
                role: res.dataValues.role
            };
        }
    } catch (err) {
        return {error: err};
    }
}

export const getStudentInfo = async(data)=>{
    try {
        const res = await student.findOne({
            where: {
                email: data.email
            }
        });
        if (res == null) {
            return {error: 'account does not exist'};
        } else {
            return {
                username: res.dataValues.username,
                level: res.dataValues.level,
                matricNumber: res.dataValues.matricNumber,
                department: res.dataValues.department,
                registerCourses: res.dataValues.registeredCourses,
                calenderEvents: res.dataValues.calenderEvents
            };
        };
    } catch (err) {
        return {error: err};
    };
};

export const getStudentCount = async(data)=>{
    try {
        const res = await student.findAll({
            where: {
                department: data.department
            }
        });
        return {status: true, value: res.length};
    } catch (err) {
        return {error: err};
    }
}

export const updateStudentAcctStatus = async(data)=>{
    try {
        const res = await student.update({
            acctStatus: data.acctStatus,
        }, {
            where: {
                email: data.email
            }
        });
        console.log(res);
        return true;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const updateStudentInfo = async(data)=>{
    try {
        await student.update({
            program: data.program,
            level: data.level,
            department: data.department,
            registeredCourses: data.registeredCourses,
            faculty: data.faculty,
            academicYear: data.academicYear
        }, {
            where: {
                email: data.email,
            }
        });
        return true;
    } catch (err) {
        return err;
    };
};


export const deleteStudent = async(data)=>{
    try {
        await student.destroy({
            where: {
                email: data.email,
            }
        })
        return true;
    } catch (err) {
        console.log(err);
        return err;
    }
}
