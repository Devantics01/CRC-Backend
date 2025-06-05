import jwt from 'jsonwebtoken';
import { registerToken } from '../controller/tokenController.js';
import dotenv from 'dotenv';

dotenv.config();
export const generateToken = async (payload)=>{
    try {
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 600});
        const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
        const registeredToken = await registerToken({
            token_data: refresh_token
        });
        if (registeredToken == true) {
            return {
            accessToken: access_token,
            refreshToken: refresh_token
        }
        } else {
            return {err: 'unable to register token'+registeredToken};
        }
    } catch (err) {
        return err;
    }
};