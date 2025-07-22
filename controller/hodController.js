import hod from "../model/hodModel.js";
import bcryptjs from "bcryptjs";

export const createHOD = async(data)=>{
    try {
        await hod.create({
            username: data.username,
            email: data.email,
            password: data.password,
            department: data.department,
            faculty: data.faculty,
            coursesManaged: data.coursesManaged,
            notesTaken: '{}',
            acctStatus: 'pending',
            role: 'hod',
        })
        return true;
    } catch (err) {
        console.log(err);
        return {error: err};
    }
};

export const findHOD = async(data)=>{
    try {
        const res = await hod.findOne({
            where:{
                email: data.email
            }
        });
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

export const getHODPayload = async(data)=>{
    try {
        const res = await hod.findOne({
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

export const getHODInfo = async(data)=>{
    try {
        const res = await hod.findOne({
            where: {
                email: data.email
            }
        });
        if (res == null) {
            return {error: 'account does not exist'};
        } else {
            return {
                username: res.dataValues.username,
                department: res.dataValues.department,
                faculty: res.dataValues.faculty,
                coursesManaged: res.dataValues.coursesManaged,
                notesTaken: res.dataValues.notesTaken
            };
        };
    } catch (err) {
        return {error: err};
    };
};

export const updateHODAcctStatus = async(data)=>{
    try {
        const res = await hod.update({
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

export const updateHODInfo = async(data)=>{
    try {
        await hod.update({
            coursesManaged: data.coursesManaged,
            notesTaken: data.notesTaken
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

export const deleteHOD = async(data)=>{
    try {
        await hod.destroy({
            where: {
                email: data.email,
            }
        })
    } catch (err) {
        return err;
    }
}
