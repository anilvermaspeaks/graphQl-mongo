
const { dateToString } = require("../../helpers/date")
const User = require('../../models/user');
const Event = require('../../models/event');



const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvents(event)
        })
    }
    catch (err) {
        throw err
    }

}


const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }

    }

    catch (err) {
        throw err
    }
}


const transformEvents = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    }
}

module.exports = {

    events: async () => {
        try {
            const eventsData = await Event.find();
            return eventsData.map(event => {
                return transformEvents(event)
            })
        }
        catch (err) {
            throw err
        }
    },


    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('unAuthenticated')
        }
        try {
            const event = new Event({
                ...args.eventInput,
                date: new Date(),
                creator: req.userId
            })
            let createdEvent;
            const result = await event.save()
            createdEvent = transformEvents(result)
            const user = await User.findById(req.userId)
            if (!user) {
                throw new Error('User not found!!!')
            }

            user.createdEvents.push(event);
            await user.save();
            return createdEvent

        }
        catch (err) {
            throw err
        }

    },
}