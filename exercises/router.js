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
    .populate('user','username firstName lastName')
    .then(exercises => {
      console.log(exercises);
      res.status(200).json(exercises);
    }).catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

// Logged in users exercises
router.get('/my', jwtAuth, (req, res) => {
  Exercise.find({username: req.user.username})
    .populate('user','username firstName lastName')
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
  .populate('user','username firstName lastName')
  // .populate('comments.user')
  .then(exercise => {
   res.status(200).json(exercise);
  }).catch(err => {
    console.error(err);
    res.status(500).json({message:'Internal server error'});
  });
});

// List exercises from a user
// router.get('/user/:userId', localAuth,  (req, res) => {
//   Exercise.find({user: req.params.userId, status: 'Public'})
//     .populate('user')
//     .then(exercises => {
//       res.status(200).json(exercises, {
//         exercises:exercises
//       }).catch(err => {
//         console.error(err);
//         res.status(500).json({message:'Internal server error'});
//       })
//     });
// });

// Process Add Exercises
router.post('/', jwtAuth, (req, res) => {
  if(req.body.videos.length > 0){
    videos = req.body.videos;
    // console.log(req.body.videos);
  } else {
    videos = null 
  }

  console.log('Req user info ', req.user);

  const newExercise = {
    title: req.body.title,
    description: stripTags(
      truncate(req.body.description)
    ),
    status: req.body.status,
    // allowComments: allowComments,
    username: req.user.username, 
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
    res.status(err.status || 400).json({message: err.message || 'Failure to update exercise'});
  });
  //   // Add to comments array
  //   // exercise.videos.push(videos);

  //   // New values
  //   exercise.title = req.body.title;
  //   exercise.description = req.body.description; 
  //   exercise.status = req.body.status;
  //   exercise.allowComments = allowComments;
  //   exercise.videos = req.body.videos;
  });

// Add Comment
router.post('/:id/comment/', jwtAuth, (req, res) => {
  Exercise.findOne({
    _id: req.params.id
  })
  .then(exercise => {
  // console.log('This is the server log for post on comments  '+ exercise)

    const newComment = {
      body: req.body.commentBody,
      user: req.user.id
    }

    // Add to comments array
    exercise.comments.unshift(newComment);

    exercise.save()
      .then(exercise => {
        res.status(200).json(exercise);
      });
  }).catch(err => {
    console.log('My error message  ' + err);
    res.status(404).json({message:'Not found'});
  });
});

// Delete Video from Technique
router.delete('/videos/:video_id', jwtAuth,  (req, res) => {
  Exercise.remove({_id: req.params.video_id})
    .then(() => {
      console.log(req.params.id);
      res.status(200).json({message:'Succussfully deleted video!'});
    }).catch(err => {
      console.log(err);
      res.status(400).json({message:'Invalid request'});
    });
});

// Delete Exercise
router.delete('/:id', jwtAuth,  (req, res) => {
  Exercise.remove({_id: req.params.id})
    .then(() => {
      console.log(req.params.id);
      res.status(200).json({message:'Succussfully deleted'});
    }).catch(err => {
      console.log(err);
      res.status(400).json({message:'Invalid request'});
    });
});

module.exports = router;