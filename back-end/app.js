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
app.get('/api/guns/gun/:input', (req, res) => {
    let input = req.params.input
    pool.query('SELECT * FROM guns RIGHT OUTER JOIN caliber ON caliber.caliber_id = guns.caliber_id WHERE caliber.caliber_id = guns.caliber_id AND name = $1',[`${input}`])
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
})

app.get('/api/ammo/:input', (req, res) => {
    let input = req.params.input
    pool.query('SELECT * FROM ammo RIGHT OUTER JOIN caliber ON caliber.caliber_id = ammo.caliber_id WHERE caliber.caliber_id = ammo.caliber_id AND name = $1',[`${input}`])
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
});
//Shows info from favorites table
app.get('/api/fav/page', (req, res) => {
    pool.query('SELECT * FROM favorites')
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
});
//Adds to favorites table
app.post('/api/fav', (req, res) => {
    let favInput = req.body;
    pool.query('INSERT INTO favorites (gun_name, cal_name) VALUES ($1, $2)', [favInput.gun, favInput.caliber])
    .then (result => {
        res.status(201).send('Added Favorite')
    });
});
//Deletes from favorites table
app.delete('/api/delete/:delete', (req, res) => {
    let deleted = req.params.delete
    pool.query('DELETE FROM favorites WHERE gun_name = $1', [`${deleted}`])
    .then(result => {
        res.status(201).send('Deleted from Favorites')
    });
})


app.listen(PORT, () => {
    console.log(`Liestening in on, ${PORT}`)
});