const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
});
CategorySchema.virtual("url").get(function () {
  return "/catalog/categories/" + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);
