const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.categoryCreateGet = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find();
  res.render("categoryForm", {
    title: "Create Category",
    categoryList: categoryList,
  });
});

// Handle category create on POST
exports.categoryCreatePost = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().escape().isLength({ min: 1 }),
  body("description", "").optional({ value: "falsy" }).trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (errors.isEmpty()) {
      // there are no errors, so we can save the category
      await category.save();
      res.redirect("/inventory/categories");
    } else {
      // there are errors, so render form again
      const categoryList = await Category.find();
      res.render("categoryForm", {
        title: "Create Category",
        categoryList: categoryList,
        category: category,
        errors: errors.array(),
      });
    }
  }),
];

// Handle category update on GET
exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find();
  const category = await Category.findById(req.params.id);
  res.render("categoryForm", {
    title: "Create Category",
    categoryList: categoryList,
    category: category,
  });
});

// Handle category update on POST
exports.categoryUpdatePost = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().escape().isLength({ min: 1 }),
  body("description", "").optional({ value: "falsy" }).trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // this is required, or a new ID will be assigned!
    });
    if (errors.isEmpty()) {
      // there are no errors, so we can find and update
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect("/inventory/category/" + req.params.id);
    } else {
      // there are errors, so render form again
      const categoryList = await Category.find();
      res.render("categoryForm", {
        title: "Create Category",
        categoryList: categoryList,
        category: category,
        errors: errors.array(),
      });
    }
  }),
];

// Handle category delete on GET

exports.categoryDeleteGet = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find();
  const category = await Category.findById(req.params.id);
  const itemList = await Item.find({ category: req.params.id });
  res.render("categoryDelete", {
    title: "Delete Category",
    categoryList: categoryList,
    category: category,
    itemList: itemList,
  });
});
// Handle category delete on POST
exports.categoryDeletePost = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.params.id);
  res.redirect("/inventory/categories");
});
