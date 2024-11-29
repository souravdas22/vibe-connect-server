const express = require("express");
const authorApiController = require("../../app/module/webservices/AuthorApiController");
const uploadUser = require("../../app/helper/userImage");
const authorRoute = express.Router();

authorRoute.get("/authors", authorApiController.getAllAuthors);
authorRoute.get("/author/details/:id", authorApiController.getAuthorDetails);
authorRoute.post(
  "/register",
  uploadUser.single("image"),
  authorApiController.register
);
authorRoute.post("/login", authorApiController.login);

module.exports = authorRoute;
