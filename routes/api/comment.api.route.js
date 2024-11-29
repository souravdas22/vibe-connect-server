const express = require("express");
const commentApiController = require("../../app/module/webservices/CommentApiController");
const commentRoute = express.Router();

commentRoute.post("/comment/create", commentApiController.createComment);

module.exports = commentRoute;
