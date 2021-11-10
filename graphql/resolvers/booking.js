const { dateToString } = require("../../helpers/date")
const User = require('../../models/user');
const Booking = require('../../models/booking');
const Event = require('../../models/event');

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
    bookings: async (req) => {
        if (!req.isAuth) {
            throw new Error('unAuthenticated')
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: dateToString(booking._doc.createdAt),
                    updatedAt: dateToString(booking._doc.updatedAt),
                }
            })
        }
        catch (err) {
            throw err
        }
    },

    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('unAuthenticated')
        }
        try {
            const event = await Event.findById({ _id: args.eventId })

            const booking = new Booking({
                user: req.userId,
                event: event
            });
            const result = await booking.save();
            return {
                ...result._doc, createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt)
            }

        }
        catch (err) {
            throw err
        }

    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('unAuthenticated')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate({ path: 'event', model: Event });
            if (booking) {
                const bookedEvent = transformEvents(booking.event)
                await booking.deleteOne({
                    _id: args.bookingId,
                })


                return bookedEvent;
            }

            else {
                throw new Error('No Booking with this id')
            }


        }
        catch (err) {
            throw err
        }

    }
}