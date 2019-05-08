var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	strategies: [String],
	local: {
		password: {
			type: String,
			required: true,
			minLength: 4,
		},
	}
});

userSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('local.password')) return next();

	//generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		//hash the password along with new SAlt
		bcrypt.hash(user.local.password, salt, function(err, hash) {
			if(err) return next(err);

			//override the clearText password with the hashed one
			user.local.password = hash;
			next();
		});
	});
});



var User = mongoose.model('User', userSchema);

module.exports = User;

// photo: {
// 	type: String,
// }