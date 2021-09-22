/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
 
  res.json({message: 'homepage routes'});
});

module.exports = router;