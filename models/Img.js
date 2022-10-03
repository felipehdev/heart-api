const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imgSchema = new Schema({
  imgId: Number,
  src: String,
  text: String,
});

mongoose.model("Img", imgSchema);
