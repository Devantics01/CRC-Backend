import otp from "../model/otpModel.js";

export const registerOTP = async(data)=>{
    try {
        await otp.create({
            email: data.email,
            otp_code: data.otp_code
        })
        return true;
    } catch (err) {
        console.log(err);
        return err;
    };
};

export const confirmOTP = async(data)=>{
    try {
        const res = await otp.findOne({
            where: {
                otp_code: data.otp_code
            }
        });
        console.log(res);
        if (res == null) {
            return false;
        } else {
            return {status: true, email: res.dataValues.email};
        }
    } catch (err) {
        return err;
    };
};

export const deleteOTP = async(data)=>{
    try {
        await otp.destroy({
            where: {
                otp_code: data.otp_code
            }
        });
        return true;
    } catch (err) {
        return err;
    };
};