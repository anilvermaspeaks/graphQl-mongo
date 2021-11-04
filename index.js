const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');

const { buildSchema, } = require('graphql');

const mongoose = require("mongoose");

const Event = require('./models/event');

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

input EventInput{
    title:String!
    description:String!
    price:Float!
}


    type RootQuery {
     events : [Event!]!
    }
    type RootMutation {
     createEvent(eventInput:EventInput):Event
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
                date: new Date()
            })
            return event.save()
                .then((res) => {
                    return { ...res._doc }
                })
                .catch(err => {
                    console.log(err)
                    throw err;
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


