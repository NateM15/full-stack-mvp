const express = require('express');
const app = express();
const cors = require('cors');

const {Pool} = require('pg');

const config = require('./config.js')["dev"]
const PORT = config.port;


const pool = new Pool({
    connectionString: config.connectionString
});
pool.connect();

app.use(cors());
app.use(express.json());
app.get('/guns/gun/:input', (req, res) => {
    let input = req.params.input
    pool.query('SELECT * FROM guns RIGHT OUTER JOIN caliber ON caliber.caliber_id = guns.caliber_id WHERE caliber.caliber_id = guns.caliber_id AND name = $1',[`${input}`])
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
})

app.get('/ammo/:input', (req, res) => {
    let input = req.params.input
    pool.query('SELECT * FROM ammo RIGHT OUTER JOIN caliber ON caliber.caliber_id = ammo.caliber_id WHERE caliber.caliber_id = ammo.caliber_id AND name = $1',[`${input}`])
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
})

app.listen(PORT, () => {
    console.log(`Liestening in on, ${PORT}`)
});