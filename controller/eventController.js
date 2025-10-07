import event from "../model/eventModel.js";

const eventMonthMapping = [
    {
        string: '01',
        month: 'january'
    },
    {
        string: '03',
        month: 'febuary'
    },
    {
        string: '03',
        month: 'march'
    },
    {
        string: '04',
        month: 'april'
    },
    {
        string: '05',
        month: 'may'
    },
    {
        string: '06',
        month: 'june'
    },
    {
        string: '07',
        month: 'july'
    },
    {
        string: '08',
        month: 'august'
    },
    {
        string: '09',
        month: 'september'
    },
    {
        string: '10',
        month: 'october'
    },
    {
        string: '11',
        month: 'november'
    },
    {
        string: '12',
        month: 'december'
    },
];


export const createEvent = async (data) => {
    try {
        await event.create({
            eventName: data.eventName,
            eventDescription: data.eventDescription,
            eventOwner: data.email,
            eventDate: data.eventDate,
            eventTime: data.eventTime,
            eventMonth: data.eventMonth,
            visibility: data.visibility,
            eventStatus: 'pending',
            eventLocation: data.eventLocation,
            eventID: data.eventID
        });
        return true;
    } catch (err) {
        console.log(err);
        return 'error';
    }
};


export const getPublicEvents = async (month) => {
    try {
        const response = await event.findAll({
            where: {
                eventMonth: month,
                visibility: 'public'
            }
        });
        if (response == null) {
            return false;
        } else {
            const eventList = [];
            let index = 0;
            while (index < response.dataValues.length) {
                const eventInstance = {
                    eventName: response.dataValues[index].eventName,
                    eventDescription: response.dataValues[index].eventDescription,
                    eventDate: response.dataValues[index].eventDate,
                    eventLocation: response.dataValues[index].eventLocation,
                    eventTime: response.dataValues[index].eventTime,
                    eventOwner: response.dataValues[index].eventOwner,
                    eventID: response.dataValues[index].eventID,
                    eventStatus: response.dataValues[index].eventStatus
                }
                eventList.push(eventInstance);
                index++;
            };
            return {status: true, info: eventList};
        }
    } catch (err) {
        console.log(err);
        return 'error';
    }
};


export const getPrivateEvents = async (month, email) => {
    try {
        const response = await event.findAll({
            where: {
                eventMonth: month,
                visibility: 'private',
                eventOwner: email
            }
        });
        if (response == null || response.dataValues.length == 0) {
            return false;
        } else {
            const eventList = [];
            let index = 0;
            while (index < response.dataValues.length) {
                const eventInstance = {
                    eventName: response.dataValues[index].eventName,
                    eventDescription: response.dataValues[index].eventDescription,
                    eventDate: response.dataValues[index].eventDate,
                    eventLocation: response.dataValues[index].eventLocation,
                    eventTime: response.dataValues[index].eventTime,
                    eventOwner: response.dataValues[index].eventOwner,
                    eventID: response.dataValues[index].eventID,
                    eventStatus: response.dataValues[index].eventStatus
                }
                eventList.push(eventInstance);
                index++;
            };
            return {status: true, info: eventList};
        }
    } catch (err) {
        console.log(err);
        return 'error';
    }
};



export const updateEvent = async (data) => {
    try {
        await event.update({
            eventDescription: data.eventDescription,
            eventDate: data.eventDate,
            eventLocation: data.eventLocation,
            eventName: data.eventName,
            eventTime: data.eventTime
        }, {
            where: {
                eventID: data.eventID
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        return 'error';
    }
};

export const deleteEvent = async (eventID) => {
    try {
        await event.destroy({
            where: {
                eventID: eventID
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        return 'error';
    }
}