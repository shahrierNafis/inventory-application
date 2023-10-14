const mongoose = require("mongoose");
const Category = require("../models/Category");
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  price: Number,
  numberInStock: Number,
});
ItemSchema.virtual("url").get(function () {
  return "/catalog/items/" + this._id;
});
module.exports = mongoose.model("Item", ItemSchema);
