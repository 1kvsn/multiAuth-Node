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

//Github
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
},
	function (accessToken, refreshToken, profile, cb) {
		//cb parameter above can also be written as done.
		console.log('.....callback function fired this');
		// console.log(profile);
		var email = profile.emails[0].value;
		User.findOne({email: email})
		.then((user, err) => {
			if(user) {
				//user found in database
				//Check if Github exists in Strategies array in Schema.
				if(user.strategies.includes(profile.provider)) {
					console.log(profile.provider, 'INCLUDED in Strategies');
					return	cb(null, user);
				} else {
					User.findOneAndUpdate({email: email}, 
						{
							$push: {strategies: profile.provider}, 
							github: {
								name: profile.displayName,
								photo: profile.photos[0].value,
							}
						}, 
						{new: true}, 
						(err, user) => {
							if(err) return cb(err);
							console.log(err, user)
							cb(null, user);
						}
					);
				} //closes else
			} else {
				//this is a new user so let's create a new user for them
				User.create({
					email: profile.emails[0].value,
					strategies: ['github'],
					github: {
						name: profile.displayName,
        		photo: profile.photos[0].value,
					}
				}, (err, user) => {
					if(err) return cb(err);
					//Sends the complete Author object to the serializer.
					cb(null, user);
				});
			}
		});
	}
));

//Twitter
const TwitterStrategy = require("passport-twitter");

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      callbackURL: "/auth/twitter/callback"
    },
    function (token, tokenSecret, profile, cb) {
			//cb parameter above can also be written as done.
			console.log('.....callback function fired this');
			// console.log(profile, 'this is twitter profile');
			var email = profile.emails[0].value;
			User.findOne({email: email})
			.then((user, err) => {
				if(user) {
					//user found in database
					//Check if Github exists in Strategies array in Schema.
					if(user.strategies.includes(profile.provider)) {
						console.log(profile.provider, 'INCLUDED in Strategies');
						return	cb(null, user);
					} else {
						User.findOneAndUpdate({email: email}, 
							{
								$push: {strategies: profile.provider}, 
								twitter: {
									name: profile.displayName,
									photo: profile.photos[0].value,
								}
							}, 
							{new: true}, 
							(err, user) => {
								if(err) return cb(err);
								console.log(err, user)
								cb(null, user);
							}
						);
					} //closes else
				} else {
					//this is a new user so let's create a new user for them
					User.create({
						email: profile.emails[0].value,
						strategies: ['twitter'],
						twitter: {
							name: profile.displayName,
							photo: profile.photos[0].value,
						}
					}, (err, user) => {
						if(err) return cb(err);
						//Sends the complete Author object to the serializer.
						cb(null, user);
					});
				}
			});
		}//ends
  )
);


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});



