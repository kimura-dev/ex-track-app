'use strict';

require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const {DATABASE_URL, PORT} = require('./config');
const bcrypt = require('bcryptjs');


// Load Models
const { Category } = require('./categories/models');

// Load Routers
const { router: usersRouter } = require('./users');
const categoryRouter = require('./categories/router');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const app = express();

// Helpers 
const {
  truncate,
  stripTags
} = require('./helpers/helpers');


// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


// Passport Middleware
passport.use(localStrategy);
passport.use(jwtStrategy);

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});



// Use Routes
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/categories/', categoryRouter);
// app.use('/api/logs/', logRouter);


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(dburl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dburl || DATABASE_URL,  { useNewUrlParser: true } , err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
