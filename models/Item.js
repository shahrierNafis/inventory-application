const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: mongoose.ObjectId,
  price: Number,
  numberInStock: Number,
});
ItemSchema.virtual("url").get(function () {
  return "/catalog/items/" + this._id;
});
