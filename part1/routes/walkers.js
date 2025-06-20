const express = require('express');
const router = express.Router();
const getConnection = require('../db');

router.get('/summary', async (req, res) => {
    const connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT u.username AS walker_username,
              COUNT(wr.rating) AS total_ratings,
              AVG(wr.rating) AS average_rating,
              SUM(CASE WHEN wreq.status = 'completed' THEN 1 ELSE 0 END) AS completed_walks
       FROM Users u
       LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status='accepted'
       LEFT JOIN WalkRequests wreq ON wa.request_id = wreq.request_id
       LEFT JOIN WalkRatings wr ON wreq.request_id = wr.request_id AND wr.walker_id = u.user_id
       WHERE u.role='walker'
       GROUP BY u.username`
    );

    await connection.end();
    res.status(200).json(rows);

});

module.exports = router;
