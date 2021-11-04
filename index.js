const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;



const app = express();

app.use(bodyParser.json())


app.get('/', (req, res, next) => {
    res.send("hello world")
})


app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`)
})