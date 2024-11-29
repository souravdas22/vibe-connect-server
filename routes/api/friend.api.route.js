const express = require("express");
const friendApiController = require("../../app/module/webservices/FriendApiController");
const friendRouter = express.Router();

friendRouter.post("/send-request", friendApiController.sendFriendRequest);

friendRouter.post("/accept-request", friendApiController.acceptFriendRequest);

friendRouter.delete("/remove-friend", friendApiController.removeFriend);


friendRouter.get("/friends/:userId", friendApiController.getFriendsList);

friendRouter.get(
  "/friends/pending/:userId",
  friendApiController.getPendingFriendRequests
);


module.exports = friendRouter;
