const express = require('express');
const router = express.Router();
const passport = require('passport');
const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});
const bodyParser = require('body-parser');
const {ensurePublicOrOwner} = require('../helpers/auth');
const {
  truncate,
  stripTags
} = require('../helpers/helpers');
const {Exercise} = require('./models');


// Exercise Index
router.get('/', (req, res) => {
  Exercise.find({status:'Public'})
    .populate('user')
    .then(exercises => {
      console.log(exercises);
      res.status(200).json(exercises);
    }).catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

// Logged in users exercises
router.get('/my', jwtAuth, (req, res) => {
  Exercise.find({user: req.user.id})
    .populate('user')
    .then(exercises => {
      res.status(200).json(exercises);
      console.log(req.user.id);
    }).catch(err => {
      console.error(err);
      res.status(500).json({message:'Internal server error'});
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
router.get('/user/:userId', localAuth,  (req, res) => {
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


// Add Exercise Form
// router.get('/add', ensureAuthenticated, (req, res) => {
//   res.json(exercise);
// });

// Edit Exercise Form
// router.get('/edit/:id', localAuth, ensurePublicOrOwner, (req, res) => {
//   Exercise.findOne({
//     _id: req.params.id
//   })
//   .then(exercise => {
//     if(exercise.user != req.user.id){
//       res.status(400).json({message:'Invalid request'});
//     } else {
//       res.status(200).json(exercise);
//     }
//   });
// });

// Process Add Exercises
router.post('/', jwtAuth, (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }
  
  if(req.body.videos.length > 0){
    videos = req.body.videos;
    // console.log(req.body.videos);
  } else {
    videos = null 
  }

  console.log(req.body);

  const newExercise = {
    title: req.body.title,
    description: stripTags(
      truncate(req.body.description,150)
    ),
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id, 
    videos: JSON.parse(videos)
  }
  console.log('-------------------------------------------');
  console.log(newExercise); 
  // Create Exercise
  new Exercise(newExercise)
    .save()
    .then(exercise => {
      console.log(exercise);
      res.status(200).json(exercise);
    }).catch(err => {
      console.log(err);
      res.status(400).json({message:'Invalid request'});
    });
});

// Edit Form Process
router.put('/:id', jwtAuth, (req, res) => {
  Exercise.findByIdAndUpdate(req.params.id, {

      ...req.body, videos: JSON.parse(req.body.videos)
  }, {
    new: true
  }).then((data) =>{
    console.log(data);
    res.status(200).json(data);
  }).catch((err) => {
    console.log(err);
  });
  // .then(exercise => {
  //   let allowComments;
  //   console.log(exercise);
  //   if(req.body.allowComments){
  //     allowComments = true;
  //   } else {
  //     allowComments = false;
  //   }

  //   // Add to comments array
  //   // exercise.videos.push(videos);

  //   // New values
  //   exercise.title = req.body.title;
  //   exercise.description = req.body.description; 
  //   exercise.status = req.body.status;
  //   exercise.allowComments = allowComments;
  //   exercise.videos = req.body.videos;
  });


// Delete Exercise
router.delete('/:id', jwtAuth,  (req, res) => {
  Exercise.remove({_id: req.params.id})
    .then(() => {
      res.status(200).json({message:'Succussfully deleted'});
    }).catch(err => {
      console.log(err);
      res.status(400).json({message:'Invalid request'});
    });
});

// Add Comment
router.post('exercises/comment/:id', localAuth, (req, res) => {
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
// router.post('exercises/rating/:id', (req, res) => {
//   Exercise.findOne({
//     _id: req.params.id
//   })
//   .then(exercise => {
//     const newRating = {
//       date: req.body.ratingDate, // not sure if req.body will work for date
//       user: req.user.id
//     }

//     // Add to Ratings Array
//     exercise.ratings.unshift(newRatings);

//     exercise.save()
//       .then(exercise => {
//         res.json(exercise);
//       });
//   });
// });


module.exports = router;