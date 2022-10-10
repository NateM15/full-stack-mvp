const express = require('express');
const app = express()

const PORT = 8001;

const {Client} = require('pg');


app.listen(PORT, () => {
    console.log(`Liestening in on, ${PORT}`)
});