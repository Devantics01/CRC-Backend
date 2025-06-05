import lecturer from "../model/lecturerModel.js";
import bcryptjs from "bcryptjs";

export const createLecturer = async(data)=>{
    try {
        await lecturer.create({
            username: data.username,
            email: data.email,
            password: data.password,
            department: data.department,
            faculty: data.faculty,
	        program: data.program,
            levelsTaught: data.levelsTaught,
            staffID: data.staffID,
            assignedCourses: data.assignedCourses,
            acctStatus: 'pending',
            role: 'lecturer'
        })
        return true;
    } catch (err) {
        return {error: err};
    }
};

export const findLecturer = async(data)=>{
    try {
        const res = await lecturer.findOne({
            where:{
                email: data.email
            }
        });
        console.log(res);
        if (res == null) {
            return {msg: 'account not found'};
        } else {
            const isMatch = await bcryptjs.compare(data.password, res.dataValues.password);
            if (isMatch == true) {
                return true;
            }
            else {
                return {msg: 'incorrect password'};
            };
        };
    } catch (err) {
        return {msg: err};
    }
}

export const getLecturerPayload = async(data)=>{
    try {
        const res = await lecturer.findOne({
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
                role: res.dataValues.role
            };
        }
    } catch (err) {
        return {error: err};
    }
}

export const getLecturerInfo = async(data)=>{
    try {
        const res = await lecturer.findOne({
            where: {
                email: data.email
            }
        });
        if (res == null) {
            return {error: 'account does not exist'};
        } else {
            return {
                username: res.dataValues.username,
                staffID: res.dataValues.staffID,
                levelsTaught: res.dataValues.levelsTaught,
                department: res.dataValues.department,
                faculty: res.dataValues.faculty,
                program: res.dataValues.program,
                assignedCourses: res.dataValues.assignedCourses
            };
        };
    } catch (err) {
        console.log(err);
        return {error: err};
    };
};

export const updateLecturerAcctStatus = async(data)=>{
    try {
        await lecturer.update({
            acctStatus: data.acctStatus,
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

export const updateLecturerInfo = async(data)=>{
    try {
        await lecturer.update({
            program: data.program,
            department: data.department,
            assignedCourses: data.assignedCourses,
            faculty: data.faculty,
            staffID: data.staffID
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

export const deleteLecturer = async(data)=>{
    try {
        await lecturer.destroy({
            where: {
                email: data.email,
            }
        })
    } catch (err) {
        return err;
    }
}