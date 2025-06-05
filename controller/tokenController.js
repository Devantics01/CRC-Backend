import token from "../model/tokenModel.js";

export const registerToken = async(data)=>{
    try {
        await token.create({
            token_data: data.token_data
        })
        return true;
    } catch (err) {
        return err;
    };
};

export const confirmToken = async(data)=>{
    try {
        const res = await token.findOne({
            where: {
                token_data: data.refreshToken
            }
        });
        if (res.dataValues.token_data == data.refreshToken) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return err;
    };
};

export const deleteToken = async(data)=>{
    try {
        await token.destroy({
            where: {
                token_data: data.refreshToken
            }
        });
        return true;
    } catch (err) {
        return err;
    };
};