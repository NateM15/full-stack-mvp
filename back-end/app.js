const express = require('express');
const app = express();
const cors = require('cors');

const {Pool} = require('pg');

const config = require('./config.js')[process.env.NODE_ENV||"dev"]
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
app.get('/api/guns', (req, res) => {
    let input = req.params.input
    pool.query('SELECT * FROM guns RIGHT OUTER JOIN caliber ON caliber.caliber_id = guns.caliber_id WHERE caliber.caliber_id = guns.caliber_id')
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
})

app.get('/api/ammo', (req, res) => {
    let input = req.params.input
    pool.query('SELECT * FROM ammo RIGHT OUTER JOIN caliber ON caliber.caliber_id = ammo.caliber_id WHERE caliber.caliber_id = ammo.caliber_id')
    .then(result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.error(error)
    });
});

app.get('/api/ammo/search/:input', (req, res) => {
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
    pool.query('INSERT INTO favorites (gun_name, cal_name) VALUES ($1, $2) ON CONFLICT (gun_name, cal_name) DO NOTHING', [favInput.gun, favInput.caliber])
    .then (result => {
        res.status(201).send('Added Favorite')
    })
    .catch(res.status(400));
});
//Deletes from favorites table
app.delete('/api/delete/:delete', (req, res) => {
    let deleted = req.params.delete
    pool.query('DELETE FROM favorites WHERE gun_name = $1', [`${deleted}`])
    .then(result => {
        res.status(201).send('Deleted from Favorites')
    });
})
//Accesses the top three
app.get('/api/topthree', (req, res) => {
    pool.query('SELECT * FROM top_three ORDER BY id ASC')
    .then(result => {
        res.send(result.rows)
    })
})
app.patch('/api/topthree/patch/:id', (req, res) => {
    let patchId = req.params.id
    let patchInfo = req.body;
    pool.query('UPDATE top_three SET name = $1, effective = $2 WHERE top_three.id = $3', [patchInfo.name, patchInfo.effective, patchId])
    .then(result => {
        res.status(201).send('Successful Patch')
    })
})

app.listen(PORT, () => {
    console.log(`Liestening in on, ${PORT}`)
});