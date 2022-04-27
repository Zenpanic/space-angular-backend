require('dotenv').config()
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const db = new Database('space-db.db');
const NASA_API_KEY = process.env.NASA_API_KEY;

const app = express();
const router = express.Router();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const port = process.env.PORT || '5000';

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cors(corsOptions));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.status(200).send('<h1>Coucou les petits loups !</h1>');
});

app.post('/asteroid', async (req, res) => {

  console.log('ok');

  const startDate = req.body.startDate;

  if (!req?.body?.startDate) return res.status(400).json([]);

  const ask = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${startDate}&api_key=${NASA_API_KEY}`, {
    method: 'GET',
    headers: {"Content-type": "application/json;charset=UTF-8"}
  });

  const data = await ask.json();

  const asteroidListRaw = [... data.near_earth_objects[startDate]];

  let asteroidList = [];

  asteroidListRaw.map(asteroid => {
    asteroidList.push({
      id: String(asteroid.id),
      name: asteroid.name,
      diamater_min: Number(asteroid.estimated_diameter.meters.estimated_diameter_min),
      diameter_max: Number(asteroid.estimated_diameter.meters.estimated_diameter_max),
      is_dangerous: asteroid.is_potentially_hazardous_asteroid,
      relative_velocity: Number(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour),
      miss_distance: Number(asteroid.close_approach_data[0].miss_distance.kilometers),
      link: asteroid.links.self
    })
  });

  return res.json(asteroidList);
});

/* const createUsers = db.prepare('CREATE TABLE utilisateurs (id int, username varchar(255), email varchar(255))');

createUsers.run(); */

/* const insertZen = db.prepare("INSERT INTO utilisateurs (id, username, email) VALUES (1, 'zenryeh', 'zenryeh@pm.me')"); */

/* insertZen.run(); */

app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});

module.exports = router;
