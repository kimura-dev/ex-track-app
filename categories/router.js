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
const {Category} = require('./models');


// Category Index
router.get('/', (req, res) => {
  Category.find({status:'Public'})
    .populate('user','username firstName lastName')
    .then(categories => {
      console.log(categories);
      res.status(200).json(categories);
    }).catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

// Logged in users categories
router.get('/my', jwtAuth, (req, res) => {
  Category.find({username: req.user.username})
    .populate('user','username firstName lastName')
    .then(categories => {
      res.status(200).json(categories);
      console.log('/my : ctaegories' +categories);
    }).catch(err => {
      console.error(err);
      res.status(500).json({message:'Internal server error'});
    });
});

// Show Single Category
router.get('/:id', (req, res) => {
  console.log('category get'+req.params.id)
  Category.findOne({
    _id: req.params.id
  })
  .populate('user','username firstName lastName')
  .populate('comments.user','username firstName lastName')
  .then(category => { 
   res.status(200).json(category);
  }).catch(err => {
    console.error(err);
    res.status(500).json({message:'Internal server error'});
  });
});

// Process Add Categories
router.post('/', jwtAuth, (req, res) => {

  console.log('Req user info ', req.user);

  const newCategory = {
    title: req.body.title,
    description: stripTags(
      truncate(req.body.description)
    ),
    status: req.body.status,
    username: req.user.username, 
    videos: req.body.videos
    // videos: JSON.parse(videos)
  }
  console.log('-------------------------------------------');
  console.log(newCategory); 
  // Create Category
  new Category(newCategory)
    .save()
    .then(category => {
      console.log(category);
      res.status(200).json(category);
    }).catch(err => {
      console.log(err);
      if(err.name === 'ValidationError'){
        return res.status(422).json({message:err.message, kind:err.kind, path: err.path, value: err.value});
      }
      res.status(400).json({message:'Invalid request'});
    });
});

// Edit Form Process
router.put('/:id', jwtAuth, (req, res) => {
  Category.findByIdAndUpdate(req.params.id, {

      // ...req.body, videos: JSON.parse(req.body.videos)
      ...req.body
  }, {
    new: true 
  }).then((data) =>{
    console.log(data);
    res.status(200).json(data);
  }).catch((err) => {
    console.log(err);
    if(err.name === 'ValidationError'){
      return res.status(422).json({message:err.message, kind:err.kind, path: err.path, value: err.value});
    }
    res.status(400).json({message:'Failed to update category'});
    });
 
  });

// Add Comment
router.post('/:id/comment/', jwtAuth, (req, res) => {
  Category.findOne({
    _id: req.params.id
  })
  .then(category => {

    const newComment = {
      body: req.body.body,
      user: req.user.username
    }

    console.log(req.user);

    // Add to comments array
    category.comments.push(newComment);

    category.save()
      .then(category => {
        res.status(200).json(category);
      });
  }).catch(err => {
    console.log('My error message  ' + err);
    if(err.name === 'ValidationError'){
      return res.status(422).json({message:err.message, kind:err.kind, path: err.path, value: err.value});
    }
    res.status(400).json({message:'Invalid Request'});
  });
});

// Delete Video from Technique
router.delete('/videos/:video_id', jwtAuth,  (req, res) => {
  console.log('This is req.params.id :  '+ req.params.video_id);

  Category.findOneAndUpdate(
    {'videos._id': req.params.video_id},
    {$pull: {videos: {_id: req.params.video_id}}},
    {new: true}
  )
  .then((category) => {
    res.status(200).json(category);
  }).catch(err => {
    console.log(err);
    if(err.name === 'ValidationError'){
      return res.status(422).json({message:err.message, kind:err.kind, path: err.path, value: err.value});
    }
    res.status(404).json({message:' Video ID Not found'});
    
  });
});

// Delete Category
router.delete('/:id', jwtAuth,  (req, res) => {
  Category.remove({_id: req.params.id})
    .then(() => {
      console.log(req.params.id);
      res.status(200).json({message:'Succussfully deleted'});
    }).catch(err => {
      console.log(err);
      if(err.name === 'ValidationError'){
        return res.status(422).json({message:err.message, kind:err.kind, path: err.path, value: err.value});
      }
      res.status(400).json({message:'Invalid request'});
    });
});

module.exports = router;