const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  postId: Number,
  title: String,
  src: String,
  text: String,
});

mongoose.model("Post", postSchema);
