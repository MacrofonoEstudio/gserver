
var mongoose = require('mongoose');
var User  = require('../../models/fideliausers');

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport){

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});


	passport.use(new FacebookStrategy({
    clientID: 315199665271079,
    clientSecret: "ae3b24781563d34b5bdf263851bdc17b",
    callbackURL: "https://fideliapp1.herokuapp.com/auth/facebook/logged",
    profileFields : ['id', 'displayName', 'photos', 'gender', 'emails'] // Campos del profile de FB que vamos a solicitar
	  },

	  function(accessToken, refreshToken, profile, done) {
	    User.findOne({provider_id: profile.id}, function(err, user) {
		    if (err) { return done(err); }

		    
		    // Si existe en la Base de Datos, lo devuelve
			if(!err && user!= null) return done(null, user);

			// Si no existe crea un nuevo objecto usuario
			var user = new User({
				provider: 'facebook',
				provider_id	: profile.id,
				name : profile.displayName,
				photo : profile.photos[0].value,
				gender : profile.gender,
				email : profile.emails[0].value,
				password: '',
				verify: false,
			});
			//...y lo almacena en la base de datos
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});

	    });
	  }
	));


	passport.use(new LocalStrategy(
	  function(username, password, done) {
	    User.findOne({ email: username }, function(err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	      	console.log('Usuario Incorrrecto');
	        return done(null, false, { message: 'Incorrect username.' });
	      }
	      
	      user.comparePassword(password, function(err, isMatch) {
		      if (isMatch) {
		      	console.log(user.name + " Passwords match!");
		        return done(null, user);		        
		      } else {
		        return done(null, false, { message: 'Incorrect password.' });
		      }
		  });

	    });
	  }
	));

};