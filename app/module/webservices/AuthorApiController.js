const { default: mongoose } = require("mongoose");
const AuthorModel = require("../author/model/author.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthorApiController {
  async getAllAuthors(req, res) {
    try {
      const authorsWithPosts = await AuthorModel.aggregate([
        {
          $lookup: {
            from: "posts", 
            localField: "_id", // Field in Author that contains author IDs
            foreignField: "userId", // Field in Post that matches the author ID
            as: "posts", // Field to store the joined posts
          },
        },
        {
          $unwind: {
            path: "$posts", // Unwind the posts array
            preserveNullAndEmptyArrays: true, // Preserve authors without posts
          },
        },
        {
          $lookup: {
            from: "comments", 
            localField: "posts.comments", 
            foreignField: "_id", 
            as: "posts.comments",
          },
        },
        {
          $group: {
            _id: "$_id", // Group by author ID
            username: { $first: "$username" },
            image: { $first: "$image" },
            email: { $first: "$email" },
            bio: { $first: "$bio" },
            friends: { $first: "$friends" },
            posts: { $push: "$posts" },
          },
        },
        {
          $sort: {
            username: 1,
          },
        },
      ]);

      // Check if authors were found
      if (!authorsWithPosts.length) {
        return res.status(404).json({ message: "No authors found" });
      }

      // Return all authors with their posts and comments
      res.status(200).json({
        status: 200,
        message: "Authors and their posts fetched successfully",
        data: authorsWithPosts,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Error fetching authors: ${error.message}`,
      });
    }
  }
  async getAuthorDetails(req, res) {
    try {
      const id = req.params.id;
      const authorDetails = await AuthorModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "posts",
          },
        },
        {
          $unwind: {
            path: "$posts",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "posts.comments",
            foreignField: "_id",
            as: "posts.comments",
          },
        },
        {
          $group: {
            _id: "$_id",
            username: { $first: "$username" },
            email: { $first: "$email" },
            friends: { $first: "$friends" },
            posts: { $push: "$posts" },
            image: { $first: "$image" },
            bio: { $first: "$bio" },
          },
        },
      ]);
      res.status(200).json({
        status: 200,
        message: "Author details fetched successfully",
        data: authorDetails,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Error creating post ${error}`,
      });
    }
  }
  async register(req, res) {
    try {
      const existingUser = await AuthorModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          error: true,
          message: "User with this email already exists",
        });
      }
      const { username, email, bio, status, image } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new AuthorModel({
        username,
        email,
        password: hashedPassword,
        bio,
        status,
        image,
      });
       if (req.file) {
         newUser.image = req.file.path;
       }

      await newUser.save();

      res.status(201).json({
        status: 201,
        message: "Account created successfully",
      });
    } catch (err) {
      // Handle any unexpected errors
      res.status(500).json({
        error: true,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  }

  async login(req, res) {
    try {
      const user = await AuthorModel.findOne({ email: req.body.email });
      if (!user)
        return res
          .status(401)
          .json({ error: true, message: "Invalid email or password" });

      const verifiedPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!verifiedPassword)
        return res
          .status(401)
          .json({ error: true, message: "Invalid email or password" });
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        "kdjkfjdkjf"
      );
      res.status(200).json({
        status: 200,
        message: "Logged in sucessfully",
        data: user,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }
}
const authorApiController = new AuthorApiController();
module.exports = authorApiController;
