import express from 'express';
import { confirmToken, deleteToken } from '../controller/tokenController.js';
import jwt from 'jsonwebtoken';

const router = express.Router()

router.post('/renew', async(req, res)=>{
    try {
        const confirmedToken = await confirmToken({refreshToken: req.body.refreshToken});
        if (confirmedToken == true) {
            jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
            if(err) return res.sendStatus(401);
            req.user = user;
            const newToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 600});
            res.json({msg:'success', token: newToken});
            });
        } else {
            res.json({msg:'unregistered token', err: confirmedToken})
        }
    } catch (err) {
        res.json({msg:'unable to renew token', error: err});
    }
});

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