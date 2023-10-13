const { default: mongoose } = require("mongoose");
const mongoDB = require("mongoose");

const CategoriesSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
});
CategoriesSchema.virtual("url").get(function () {
  return "/catalog/categories/" + this._id;
});

module.exports = mongoose.model("Categories", CategoriesSchema);
