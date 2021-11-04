const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');

const { graphqlHTTP } = require('express-graphql');

const { buildSchema, } = require('graphql');

const mongoose = require("mongoose");

const Event = require('./models/event');
const User = require('./models/user');
const PORT = 3000;



const app = express();

app.use(bodyParser.json())



const events = [];

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
type Event {
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
}

type User {
    _id:ID!
    email:String!
    password:String
}

input EventInput{
    title:String!
    description:String!
    price:Float!
}


input UserInput{
    email:String!
    password:String!
}

    type RootQuery {
     events : [Event!]!
    }
    type RootMutation {
     createEvent(eventInput:EventInput):Event
     createUser(userInput:UserInput):User
    }
    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then((events) => {
                    return events.map(event => {
                        return {
                            ...event._doc,
                        }
                    })
                })
                .catch((err) => {
                    throw err
                })
        },

        createEvent: (args) => {
            const event = new Event({
                ...args.eventInput,
                date: new Date(),
                creator: "6183b4f7f6ae436ad03e8506"
            })
            let createdEvent;
            return event.save()
                .then((res) => {
                    createdEvent = { ...res._doc }
                    return User.findById('6183b4f7f6ae436ad03e8506')
                        .then((user) => {
                            if (!user) {
                                throw new Error('User not found!!!')
                            }

                            user.createdEvents.push(event);
                            return user.save()

                        })
                        .then(() => {
                            return createdEvent
                        })
                        .catch((err) => {

                        })

                })
                .catch(err => {
                    console.log(err)
                    throw err;
                })

        },
        createUser: (args) => {
            return User.findOne({ email: args.userInput.email }).then((user) => {
                if (user) {
                    throw new Error('User exists already.')
                }

                return bcrypt.hash(args.userInput.password, 12).then((hashedPwd) => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPwd
                    })
                    return user.save();
                })
                    .then(res => {
                        return { ...res._doc, password: null }
                    })
                    .catch((err) => {
                        throw err
                    })

            })


        }
    },
    graphiql: true
}))


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.r9xle.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(PORT, () => {
        console.log(`app running on PORT ${PORT}`)
    })
})
    .catch((e) => {
        console.warn(e)
    })


