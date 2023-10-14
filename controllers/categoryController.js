const Category = require("../models/Category");
const Item = require("../models/Item");

// Handle category list on GET
exports.categoryList = async (req, res, next) => {
  const categories = await Category.find();
  res.render("categories", {
    categories: categories,
  });
};

// Handle items list on GET
exports.items = async (req, res, next) => {
  const items = await Item.find({ category: req.params.id });
  res.render("items", {
    items: items,
  });
};
// Handle category create on GET
exports.categoryCreateGet = (req, res, next) => {
  res.render("categoryForm");
};

// Handle category create on POST
exports.categoryCreatePost = async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });
  await category.save();
  res.redirect("/catalog/categories");
};

// Handle category update on GET
exports.categoryUpdateGet = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render("categoryForm", {
    category: category,
  });
};

// Handle category update on POST
exports.categoryUpdatePost = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  category.name = req.body.name;
  category.description = req.body.description;
  await category.save();
  res.redirect("/catalog/categories");
};

// Handle category delete on GET

exports.categoryDeleteGet = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render("categoryDelete", {
    category: category,
  });
};
// Handle category delete on POST
exports.categoryDeletePost = async (req, res, next) => {
  await Category.findByIdAndRemove(req.params.id);
  res.redirect("/catalog/categories");
};
