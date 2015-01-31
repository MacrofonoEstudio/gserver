var express = require('express');
var router = express.Router();
var User  = require('../models/users');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// Configuración de nodemailer
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'garitoapp@gmail.com',
        pass: 'macrofono'
    }
});


router.get('/', function(req, res) {

	res.render('index');

});

router.post('/users', function(req, res) {

	var user = new User();		// create a new instance of the model
	user.name = req.body.name;  // set the name (comes from the request)
	user.surname = req.body.surname;

	user.save(function(err) {
		if (err)
			res.send(err);

		res.render('home');
	});

});


router.get('/jsonp', function(req, res) {

	User.find(function(err, users) {
		if (err)
			res.send(err);

		res.jsonp(users);
	});

});

//PASSPORT Facebook

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] })); // In Scope we include the Extended Permissions (Out of the general profile (Name...)) we want to use from FB

router.get('/auth/facebook/logged', passport.authenticate('facebook', { successRedirect: '/logged', failureRedirect: '/login'}));



// Passport Local user/pw
router.post('/login',
	passport.authenticate('local', { successRedirect: '', failureRedirect: '/loginfail' }),
	function(req, res){ // When visiting this route first Passport tries to authentificate the user, if ok it proceeds to the next function

	console.log('Usuario registrado!' + req.user.name);
});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




module.exports = router;