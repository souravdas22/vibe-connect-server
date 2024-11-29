const { default: mongoose } = require("mongoose");
const AuthorModel = require("../author/model/author.model");
const FriendsModel = require("../friends/model/friends.model");

class FriendApiController {
  async sendFriendRequest(req, res) {
    try {
      const { userId, friendId } = req.body;
      const existingRequest = await FriendsModel.findOne({
        user: userId,
        friend: friendId,
      });

      if (existingRequest) {
        return res.status(400).json({ message: "Friend request already sent" });
      }
      const newRequest = await FriendsModel.create({
        user: userId,
        friend: friendId,
        status: "pending",
      });

      res
        .status(201)
        .json({ message: "Friend request sent", data: newRequest });
    } catch (error) {
      res.status(500).json({ message: "Failed to send friend request", error });
    }
  }

  async acceptFriendRequest(req, res) {
    try {
      const { userId, friendId } = req.body;

      const updatedFriendRequest = await FriendsModel.findOneAndUpdate(
        { user: friendId, friend: userId, status: "pending" },
        { status: "confirmed" },
        { new: true }
      );

      if (!updatedFriendRequest) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      await AuthorModel.findByIdAndUpdate(userId, {
        $addToSet: { friends: friendId },
      });
      await AuthorModel.findByIdAndUpdate(friendId, {
        $addToSet: { friends: userId },
      });

      res.status(200).json({
        message: "Friend request accepted",
        data: updatedFriendRequest,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to accept friend request", error });
    }
  }

  // Remove Friend
  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.body;
      const removedFriend = await FriendsModel.findOneAndDelete({
        $or: [
          { user: userId, friend: friendId, status: "confirmed" },
          { user: friendId, friend: userId, status: "confirmed" },
        ],
      });
      if (!removedFriend) {
        return res.status(404).json({ message: "Friend not found" });
      }
      res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove friend", error });
    }
  }

  // Get Friends List
  async getFriendsList(req, res) {
    try {
      const { userId } = req.params;

      const friends = await FriendsModel.aggregate([
        {
          $match: {
            $or: [
              {
                user: new mongoose.Types.ObjectId(userId),
                status: "confirmed",
              },
              {
                friend: new mongoose.Types.ObjectId(userId),
                status: "confirmed",
              },
            ],
          },
        },
        {
          $addFields: {
            friendId: {
              $cond: {
                if: { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                then: "$friend",
                else: "$user",
              },
            },
          },
        },
        {
          $lookup: {
            from: "authors",
            localField: "friendId",
            foreignField: "_id",
            as: "friendDetails",
          },
        },
        {
          $unwind: "$friendDetails",
        },
        {
          $project: {
            _id: 0,
            friendId: "$friendDetails._id",
            username: "$friendDetails.username",
            email: "$friendDetails.email",
            image: "$friendDetails.image",
          },
        },
      ]);

      res
        .status(200)
        .json({ message: "Friends list fetched successfully", data: friends });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Failed to fetch friends list ${error}` });
    }
  }
  async getPendingFriendRequests(req, res) {
    try {
      const { userId } = req.params;

      const pendingRequests = await FriendsModel.aggregate([
        {
          $match: {
            friend: new mongoose.Types.ObjectId(userId),
            status: "pending",
          },
        },
        {
          $lookup: {
            from: "authors",
            localField: "user",
            foreignField: "_id",
            as: "requesterDetails",
          },
        },
        {
          $unwind: "$requesterDetails",
        },
        {
          $project: {
            _id: 0,
            requesterId: "$requesterDetails._id",
            username: "$requesterDetails.username",
            email: "$requesterDetails.email",
            image: "$requesterDetails.image",
          },
        },
      ]);

      res.status(200).json({
        message: "Pending friend requests fetched successfully",
        data: pendingRequests,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch pending friend requests",
        error,
      });
    }
  }
}

const friendApiController = new FriendApiController();
module.exports = friendApiController;
