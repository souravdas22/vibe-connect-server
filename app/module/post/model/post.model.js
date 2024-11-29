const { Schema, model, Types, default: mongoose } = require("mongoose");

const PostSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "Author",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hashtags: {
      type: [String],
      required: true,
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    image: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
