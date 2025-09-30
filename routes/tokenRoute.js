import express from 'express';
import { confirmToken, deleteToken } from '../controller/tokenController.js';
import jwt from 'jsonwebtoken';

const router = express.Router()

router.delete('/logout', async(req, res)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null) return sendStatus(401);

        const deletedToken = await deleteToken({refreshToken: token});
        console.log(deletedToken);
        if (deletedToken == true) {
            res.json({msg: 'logout successful'});
        } else {
            res.json({msg: 'logout unsuccessful', error: deletedToken})
        }
    } catch (err) {
        res.json({msg: 'error', error: err});
    }
})

export default router;