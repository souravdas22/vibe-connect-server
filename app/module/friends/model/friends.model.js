const { Schema, model, Types } = require("mongoose");

const FriendsSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Author", 
      required: true,
    },
    friend: {
      type: Types.ObjectId,
      ref: "Author", 
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "blocked"],
      default: "pending",
    },
  },
  { versionKey: false, timestamps: true }
);

const FriendsModel = model("Friends", FriendsSchema);
module.exports = FriendsModel;
