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
        if (publicEvents.status == true && privateEvents.status == true) {
            res.json({
                msg: 'success',
                publicEvents: publicEvents.info,
                privateEvents: privateEvents.info
            });
        } else if (publicEvents.status == true && privateEvents == false) {
            res.json({
                msg: 'no private events',
                publicEvents: publicEvents.info
            })
        } else if (publicEvents == false && privateEvents.status == true) {
            res.json({
                msg: 'no public events',
                privateEvents: privateEvents.info
            })
        } else {
            res.json({
                msg: 'no events'
            })
        }
    } catch (err) {
        res.json({
            msg: 'error',
            error: err.message
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
            eventTime: req.body.eventTime,
            email: req.user.email
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
        const deleted = await deleteEvent(req.body.eventID, req.user.email);
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