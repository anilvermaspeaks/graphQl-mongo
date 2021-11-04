const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');

const { buildSchema, } = require('graphql');



const PORT = 3000;



const app = express();

app.use(bodyParser.json())


app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type RootQuery {
     events : [String!]
    }
    type RootMutation {
     createEvent(name:String):String
    }
    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue: {
        events: () => {
            return ['sdsdf', 'fdfd', 'ffffg']
        },

        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}))


app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`)
})