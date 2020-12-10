var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Post = require('../models/post');

router.get('/', (req, res, next) => {
  Post.find()
  .then(posts => {
      res.status(200).json({
          message: 'Posts fetched successfully!',
          posts: posts
      });
  })
  .catch(error => {
      res.status(500).json({
          message: 'An error occurred',
          error: error
      });
  });
});


router.post('/', (req, res, next) => {
    const maxPostId = sequenceGenerator.nextId("posts");
  
    const post = new Post({
      id: maxPostId,
      title: req.body.title,
      date: req.body.date,
      imageUrl: req.body.imageUrl,
      content: req.body.content
    });
  
    post.save()
      .then(createdPost => {
        res.status(201).json({
          message: 'Post added successfully',
          post: createdPost
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
  });

  router.put('/:id', (req, res, next) => {
    Post.findOne({ id: req.params.id })
      .then(post => {
        post.title = req.body.title;
        post.date = req.body.date;
        post.imageUrl = req.body.imageUrl;
        post.content = req.body.content;
  
        Post.updateOne({ id: req.params.id }, post)
          .then(result => {
            res.status(204).json({
              message: 'Post updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Post not found.',
          error: { post: 'Post not found'}
        });
      });
  });
  
  router.delete("/:id", (req, res, next) => {
    Post.findOne({ id: req.params.id })
      .then(post => {
        Post.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "Post deleted successfully" 
            });
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Post not found.',
          error: { post: 'Post not found'}
        });
      });
  });


module.exports = router; 
