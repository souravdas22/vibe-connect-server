const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true,versionKey:false }
);

const CommentModel = mongoose.model("Comment", commentSchema);
module.exports = CommentModel;
