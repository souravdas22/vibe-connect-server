const {Schema,model,Types} = require('mongoose');

const AuthorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    friends: [
      {
        type: Types.ObjectId,
        ref: "Author",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const AuthorModel = model('Author', AuthorSchema);
module.exports = AuthorModel;