const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');

const mongoose = require("mongoose");

const graphQlSchema = require('./graphql/schema')

const graphQlResolvers = require('./graphql/resolvers')


const PORT = 3000;



const app = express();

app.use(bodyParser.json())




app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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


