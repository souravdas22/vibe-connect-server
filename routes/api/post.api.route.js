const express = require('express');
const postApiController = require('../../app/module/webservices/PostApiController');
const { authCheck } = require('../../app/middleware/auth.middleware');
const uploadPost = require('../../app/helper/postImage');
const postRoute = express.Router()

postRoute.post('/post/create',authCheck,uploadPost.single('image'),postApiController.createPost)
postRoute.get("/posts", postApiController.getAllPostsWithComments);
postRoute.post("/posts/:id/like",authCheck, postApiController.likePost);
postRoute.post("/posts/:id/dislike",authCheck, postApiController.dislikePost);


module.exports = postRoute;
