const asyncHandler = require("express-async-handler");

const Category = require("../models/Category");
const Item = require("../models/Item");

// Handle category list on GET
exports.categoryList = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  const itemList = await Item.find();
  res.render("categories", {
    categoryList: categories,
    itemList: itemList,
  });
});

// Handle items list on GET
exports.items = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ category: req.params.id });
  const categoryList = await Category.find();
  const category = await Category.findById(req.params.id);
  console.log(category.name);
  res.render("items", {
    title: category.name,
    category: category,
    itemList: items,
    categoryList: categoryList,
  });
});
// Handle category create on GET
exports.categoryCreateGet = (req, res, next) => {
  res.render("categoryForm");
};

// Handle category create on POST
exports.categoryCreatePost = asyncHandler(async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });
  await category.save();
  res.redirect("/catalog/categories");
});

// Handle category update on GET
exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render("categoryForm", {
    category: category,
  });
});

// Handle category update on POST
exports.categoryUpdatePost = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  category.name = req.body.name;
  category.description = req.body.description;
  await category.save();
  res.redirect("/catalog/categories");
});

// Handle category delete on GET

exports.categoryDeleteGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render("categoryDelete", {
    category: category,
  });
});
// Handle category delete on POST
exports.categoryDeletePost = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.params.id);
  res.redirect("/catalog/categories");
});
