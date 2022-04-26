require('dotenv').config()
const express = require('express');
const Database = require('better-sqlite3');

const db = new Database('space-db.db');
const NASA_API_KEY = process.env.NASA_API_KEY;
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('<h1>Coucou les petits loups !</h1>');
});

router.post('/asteroid', async (req, res) => {
  const { startDate } = req.body.startDate;

  if (!startDate) return;

  const ask = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${startDate}&api_key=${NASA_API_KEY}`, {
    method: 'GET',
    headers: {"Content-type": "application/json;charset=UTF-8"}
  });

  const data = await ask.json();

  console.log(data);

  return res.json({data: data});
});

/* const createUsers = db.prepare('CREATE TABLE utilisateurs (id int, username varchar(255), email varchar(255))');

createUsers.run(); */

/* const insertZen = db.prepare("INSERT INTO utilisateurs (id, username, email) VALUES (1, 'zenryeh', 'zenryeh@pm.me')"); */

/* insertZen.run(); */

module.exports = router;
