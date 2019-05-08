var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/User');
var bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
//Match User 
User.findOne({email: email})
	.then(user => {
		//if no user found
		if(!user) {
			//returning false for the user below
			return done(null, false, {message: 'That email is not registered' });
		}

		//Match Password
		bcrypt.compare(password, user.local.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch) {
				//if matched, return user
				console.log('Inside bcrypt.compare: Password Matched !!!');
				return done(null, user);
			} else {
				return done(null, false, {message: 'Incorrect Password. Please try again!'
				});
			}
		})
	})
	.catch(err => console.log(err));
})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});



