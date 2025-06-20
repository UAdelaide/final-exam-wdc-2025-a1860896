const express = require('express');
const router = express.Router();
const getConnection = require('../db');

router.get('/', async (req, res) => {
    const connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT d.name AS dog_name, d.size, u.username AS owner_username
       FROM Dogs d
       JOIN Users u ON d.owner_id = u.user_id`
    );
    await connection.end();
    res.status(200).json(rows);
});

module.exports = router;