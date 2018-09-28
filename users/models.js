'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({

  email: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // local            : {
  //   email        : String,
  //   password     : String,
  // },
  //   facebook         : {
  //     id           : String,
  //     token        : String,
  //     email        : String,
  //     name         : String
  // },
  // twitter          : {
  //     id           : String,
  //     token        : String,
  //     displayName  : String,
  //     username     : String
  // },
  // google           : {
  //     id           : String,
  //     token        : String,
  //     email        : String,
  //     name         : String
  // },
  // level: {
  //   type:String, 
  //   default: 'white'
  // },
  // affiliates: {
  //   type:String, default: ''
  // },
  // image: {
  //   type:String
  // },
   firstName: {
     type: String, default: ''
    },
  lastName: {
    type: String, default: ''
  }
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
