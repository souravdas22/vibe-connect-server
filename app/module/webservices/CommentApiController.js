const CommentModel = require("../Comment/model/comment.model");
const PostModel = require("../post/model/post.model");
class CommentApiController {
  async createComment(req, res) {
    try {
      const { postId, authorId, content } = req.body;

      const newComment = new CommentModel({
        post: postId,
        author: authorId,
        content,
      });

      const savedComment = await newComment.save();

      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: savedComment._id },
      });

      res.status(201).json({
        message: "Comment created and added to the post successfully",
        comment: savedComment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating comment",
        error: error.message,
      });
    }
  }

}
const commentApiController = new CommentApiController();
module.exports = commentApiController;
