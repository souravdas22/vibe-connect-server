const mongoose = require("mongoose");
const PostModel = require("../post/model/post.model");

class PostApiController {
  async getAllPostsWithComments(req, res) {
    try {
      const postsWithComments = await PostModel.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "postComments",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            hashtags: 1,
            image: 1,
            postComments: 1,
            likes: 1,
          },
        },
      ]);

      if (!postsWithComments.length) {
        return res.status(404).json({ message: "No posts found" });
      }

      res.status(200).json(postsWithComments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createPost(req, res) {
    try {
      const { title, description, hashtags } = req.body;
      const userId = req.user._id;
      const post = new  PostModel({
        userId,
        title,
        description,
        hashtags,
      });
        if (req.file) {
          post.image = req.file.path;
        }

      await post.save()
      res.status(200).json({
        status: 200,
        message: "Post created successfully",
        post: post,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating post",
        error,
      });
    }
  }

  async likePost(req, res) {
    try {
      const postId = req.params.id;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.likes.includes(req.user._id)) {
        post.likes = post.likes.filter(
          (userId) => userId.toString() !== req.user._id.toString()
        );
        post.likesCount -= 1;
      } else {
        post.likes.push(req.user._id);
        post.likesCount += 1;
      }

      const updatedPost = await post.save();

      res.status(200).json({
        status: 200,
        message: "Post liked/disliked successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Error liking/disliking post ${error}`,
      });
    }
  }

  async dislikePost(req, res) {
    try {
      const postId = req.params.id;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.likes.includes(req.user._id)) {
        post.likes = post.likes.filter(
          (userId) => userId.toString() !== req.user._id.toString()
        );
        post.likesCount -= 1;
      }

      const updatedPost = await post.save();

      res.status(200).json({
        status: 200,
        message: "Post disliked successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Error disliking post ${error}`,
        error,
      });
    }
  }
}

const postApiController = new PostApiController();
module.exports = postApiController;
