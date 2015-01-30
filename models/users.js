var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Encrypt and "I forgot" password
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto'); // Node integrated library that generates random token 

var fideliappSchema   = new Schema({
	name : String, // Nombre del usuario
	provider: String, // Facebook o Email
	provider_id : String, // ID que proporciona Twitter o Facebook...
	photo : String, // Avatar o foto del usuario
	gender : String,
	email : String,
	password: String,
	verify: Boolean,
	resetPasswordToken: String, // Código aleatorio generado por Crypto para verificar el usuario a la hora de generar un nuevo password
  	resetPasswordExpires: Date, // Tiempo que va a estar activo el código para renovar el password
	createdAt : {type: Date, default: Date.now} // Fecha de creación
});

// We modify the Mongoose Schema to encrypt the passwords in the save action
fideliappSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Adds to the schema a method that compares passwords to verify
fideliappSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('fideliaUser', fideliappSchema);