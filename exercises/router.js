const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const {ensureAuthenticated, ensurePublicOrOwner} = require('../helpers/auth');
const {Exercise} = require('./models');


// Exercise Index
router.get('/', (req, res) => {
  Exercise.find({status:'public'})
    .populate('user')
    .then(exercises => {
      res.status(200).json(exercises);
      res.send('Connected');
    }).catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

// Show Single Exercise
router.get('/:id', (req, res) => {
  Exercise.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.user')
  .then(exercise => {
   res.status(200).json(exercise);
  }).catch(err => {
    console.error(err);
    res.status(500).json({message:'Internal server error'});
  });
});

// List exercises from a user
router.get('/user/:userId', ensureAuthenticated, ensurePublicOrOwner,   (req, res) => {
  Exercise.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(exercises => {
      res.status(200).json(exercises, {
        exercises:exercises
      }).catch(err => {
        console.error(err);
        res.status(500).json({message:'Internal server error'});
      })
    });
});

// Logged in users exercises
router.get('/', ensureAuthenticated, ensurePublicOrOwner,  (req, res) => {
  Exercise.find({user: req.user.id})
    .populate('user')
    .then(exercises => {
      res.status(200).json(exercises);
    }).catch(err => {
      console.error(err);
      res.status(500).json({message:'Internal server error'});
    });
});

// Add Exercise Form
// router.get('/add', ensureAuthenticated, (req, res) => {
//   res.json(exercise);
// });

// Edit Exercise Form
router.get('/edit/:id', ensureAuthenticated, ensurePublicOrOwner, (req, res) => {
  Exercise.findOne({
    _id: req.params.id
  })
  .then(exercise => {
    if(exercise.user != req.user.id){
      res.status(400).json({message:'Invalid request'});
    } else {
      res.status(200).json(exercise);
    }
  });
});

// Process Add Exercises
router.post('/', ensureAuthenticated, (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newExercise = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments:allowComments,
    user: req.user.id
  }

  // Create Exercise
  new Exercise(newExercise)
    .save()
    .then(exercise => {
      res.status(200).json(exercise);
    }).catch(err => {
      console.log(err);
      res.status(400).json({message:'Invalid request'});
    });
});

// Edit Form Process
router.put('/:id',ensureAuthenticated,  (req, res) => {
  Exercise.findOne({
    _id: req.params.id
  })
  .then(exercise => {
    let allowComments;
    
    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    exercise.title = req.body.title;
    exercise.body = req.body.body;
    exercise.status = req.body.status;
    // exercise.allowComments = allowComments;

    exercise.save()
      .then(exercise => {
        res.status(200).json(exercise);
      });
  });
});

// Delete Exercise
router.delete('/:id', ensureAuthenticated,  (req, res) => {
  Exercise.remove({_id: req.params.id})
    .then(() => {
      res.status(200).json({message:'Succussfully deleted'});
    }).catch(err => {
      console.log(err);
      res.status(400).json({message:'Invalid request'});
    });
});

// Add Comment
router.post('exercises/comment/:id', ensureAuthenticated, (req, res) => {
  Exercise.findOne({
    _id: req.params.id
  })
  .then(exercise => {
    const newComment = {
      body: req.body.commentBody,
      user: req.user.id
    }.catch(err => {
      console.log(err);
      res.status(404).json({message:'Not found'});
    });

    // Add to comments array
    exercise.comments.unshift(newComment);

    exercise.save()
      .then(exercise => {
        res.redirect(`/exercises/show/${exercise.id}`);
      });
  });
});

// Add Rating
router.post('exercises/rating/:id', (req, res) => {
  Exercise.findOne({
    _id: req.params.id
  })
  .then(exercise => {
    const newRating = {
      date: req.body.ratingDate, // not sure if req.body will work for date
      user: req.user.id
    }

    // Add to Ratings Array
    exercise.ratings.unshift(newRatings);

    exercise.save()
      .then(exercise => {
        res.json(exercise);
      });
  });
});


module.exports = router;