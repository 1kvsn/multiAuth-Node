var express = require('express');
var router = express.Router();
var User = require('../models/User');

//Get HomePage
router.get('/', (req, res) => {
  res.render('home');
});





module.exports = router;
