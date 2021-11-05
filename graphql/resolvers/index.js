const bcrypt = require('bcryptjs');


const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');


const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            }
        })
    }
    catch (err) {
        throw err
    }

}


const singleEvent = async eventId => {
    try {
        const event = await Event.find({ _id: eventId })
        return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
        }
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
module.exports = {
    events: async () => {
        try {
            const eventsData = await Event.find();
            return eventsData.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })
        }
        catch (err) {
            throw err
        }
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                }
            })
        }
        catch (err) {
            throw err
        }
    },

    createEvent: async (args) => {
        try {
            const event = new Event({
                ...args.eventInput,
                date: new Date(),
                creator: "6183b4f7f6ae436ad03e8506"
            })
            let createdEvent;
            const result = await event.save()
            createdEvent = { ...result._doc }
            const user = await User.findById('6183b4f7f6ae436ad03e8506')
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
    createUser: async (args) => {
        try {
            const creator = await User.findOne({ email: args.userInput.email })

            if (creator) {
                throw new Error('User exists already.')
            }

            const hashedPwd = await bcrypt.hash(args.userInput.password, 12)

            const createdUser = new User({
                email: args.userInput.email,
                password: hashedPwd
            })
            const savedRes = await createdUser.save();
            return { ...savedRes._doc, password: null }

        }
        catch (err) {
            throw err
        }

    },
    bookEvent: async (args) => {
        try {
            const event = await Event.findById({ _id: args.eventId })

            const booking = new Booking({
                user: '6183b4f7f6ae436ad03e8506',
                event: event
            });
            const result = await booking.save();
            return {
                ...result._doc, createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }

        }
        catch (err) {
            throw err
        }

    },

    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId);
            if (booking) {
                const bookedEvent = {
                    ...booking.event._doc, createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                }
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