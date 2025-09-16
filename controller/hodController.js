import { where } from "sequelize";
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
            academicYear: data.academicYear,
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
                coursesManaged: res.dataValues.coursesManaged
            };
        };
    } catch (err) {
        return {error: err};
    };
};

const getNotifications = async(data)=>{
    try {
        const res = await hod.findOne({
            where: {
                department: data.department
            }
        })
        if (!res) {
            return false;
        } else {
            return {
                status: true,
                notifications: JSON.parse(res.dataValues.notifications)
            };
        };
    } catch (err) {
        return err;
    }
}

export const updateHODNotifications = async(data)=>{
    try {
        const existingNotifications = await getNotifications({department: data.department});
        if (existingNotifications.status == true) {
            let notificationList = existingNotifications.notifications.notList;
            notificationList.push(data.newNotifications);
            await hod.update({
                notifications: notificationList
            }, {
                where: {
                    department: data.department
                }
            })
        } else if(existingNotifications = false) {
            return false
        };
    } catch (err) {
        return err;
    }
}

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
