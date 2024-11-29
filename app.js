const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./app/config/db")
const bodyParser = require("body-parser");

dotenv.config();
dbConnection();
const app = express();
const cors = require('cors');
app.use(cors());


app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());



const postRoute = require("./routes/api/post.api.route");
const authorRoute = require("./routes/api/author.api.route");
const commentRoute = require("./routes/api/comment.api.route");
const friendRouter = require("./routes/api/friend.api.route");
app.use(postRoute);
app.use(authorRoute);
app.use(commentRoute);
app.use(friendRouter);

app.listen(process.env.PORT || 7001, () => {
  console.log(`App is listening on port 7000`);
});
