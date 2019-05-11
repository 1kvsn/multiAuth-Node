var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');


//Github Authentication
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
	passport.authenticate('github', 
	{ failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/users/dashboard');
	});
	
	
	// auth with twitter
	router.get("/twitter", passport.authenticate("twitter"));
	
	// redirect to home page after successfully login via twitter
	router.get(
		"/twitter/callback",
		passport.authenticate("twitter", {
			successRedirect: "/users/dashboard",
			failureRedirect: "/"
		})
		);
		
		//Logout User
	router.get('/logout', (req, res) => {
		console.log("You've successfully logged out!");
		req.logout();
		res.redirect('/');
	});


		module.exports = router;
		