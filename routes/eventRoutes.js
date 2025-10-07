import express from 'express';
import { createEvent, getPublicEvents, getPrivateEvents, updateEvent, deleteEvent } from '../controller/eventController.js';
import { authenticateToken, authorizeAccStatus, authorizeUser } from '../middleware/authMiddleware.js';
import { generateEventID } from '../helper/otpGenerator.js';

const router = express.Router();

router.post('/new', [authenticateToken, authorizeAccStatus, authorizeUser], async (req, res) => {
    try {
        const created = await createEvent({
           eventName: req.body.eventName,
           eventDescription: req.body.eventDescription,
           eventDate: req.body.eventDate,
           eventTime: req.body.eventTime,
           eventMonth: req.body.eventMonth,
           eventID: generateEventID (),
           visibility: req.body.visibility,
           eventLocation: req.body.eventLocation,
           email: req.user.email
        });
        if (created == true) {
            res.json({
                msg: 'sucess'
            })
        } else {
            res.json({
                status: 'failed'
            })
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.msg
        });
    };
});

router.get('/get', [authenticateToken, authorizeAccStatus, authorizeUser], async (req, res) => {
    try {
        const publicEvents = await getPublicEvents(req.query.month);
        const privateEvents = await getPrivateEvents(req.query.month, req.user.email);
        if (publicEvents.status == true) {
            if (privateEvents.status == true) {
                res.json({
                    msg: 'success',
                    privateEvents: privateEvents.info,
                    publicEvents: publicEvents.info
                })
            } else {
                res.json({
                    msg: 'unable to get private events',
                    publicEvents: publicEvents.info
                });
            }
        } else {
            res.json({
                msg: 'failed',
                error: err.message
            })
        }
    } catch (err) {
        res.json({
            msg: 'error'
        })
    };
});

router.put('/update', [authenticateToken, authorizeAccStatus, authorizeUser], async (req, res) => {
    try {
        const updated = await updateEvent({
            eventID: req.body.eventID,
            eventDescription: req.body.eventDescription,
            eventDate: req.body.eventDate,
            eventLocation: req.body.eventLocation,
            eventName: req.body.eventName,
            eventTime: req.body.eventTime
        });
        if (updated == true) {
            res.json({
                msg: 'success'
            })
        } else {
            res.json({
                msg: 'failed'
            })
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.message
        })
    }
});

router.delete('/delete', [authenticateToken, authorizeAccStatus, authorizeUser], async (req, res) => {
    try {
        const deleted = await deleteEvent(req.body.eventID);
        if (deleted == true) {
            res.json({
                msg: 'success'
            })
        } else {
            res.json({
                msg: 'failed'
            })
        };
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.message
        });
    }
});

export default router;