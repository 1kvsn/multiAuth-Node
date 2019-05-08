var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');
var multer  = require('multer');
var path = require('path');
var uploadPath = path.join(__dirname, '..', 'public/uploads');

//Direct folder path was not required. It would have worked without the dirPath. Just ensure the folder is created in the directory before trying to save the uploaded file.
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    //ensure the fileName is not repeated. So, added Date.now()
    cb(null, Date.now() + '-' + file.originalname)
    console.log(file, 'this is inside fileName under Storage');
  }
})
 
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/login', function(req, res) {
  res.render('index');
});


//User Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/',
  })(req, res, next);
});


//Render registration form
router.get('/register', (req, res) => {
  res.render('register');
});


router.get('/dashboard', (req, res) => {
  res.render('dashboard', {user: req.user});
})


//Registering User
router.post('/register', upload.single('photo'), (req, res, next) => {
  var newUser = {
    name: req.body.name,
    email: req.body.email,
    local: {
      password: req.body.password,
    },
  }
  console.log(req.file, 'this is the file');
  User.create(newUser, (err, user) => {
    if(err) return next(err);
    console.log(user);
    res.redirect('/users/login');
  });
});

//Logout User
router.get('/logout', (req, res) => {
  console.log("You've successfully logged out!");
  req.logout();
  res.redirect('/');
});


module.exports = router;
