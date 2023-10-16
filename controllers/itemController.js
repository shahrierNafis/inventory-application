const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");

//setting options for multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 5 * 1024 * 1024 },
});

exports.item = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  const categoryList = await Category.find();
  // item.image.data = btoa(item.image.data);
  res.render("item", {
    title: item.name,
    item: item,
    categoryList: categoryList,
  });
});

exports.items = asyncHandler(async (req, res, next) => {
  const itemList = await Item.find();
  const categoryList = await Category.find();
  res.render("items", {
    title: "All Items",
    itemList: itemList,
    categoryList: categoryList,
  });
});

// Handle item create on GET
exports.itemCreateGet = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find();
  res.render("itemForm", {
    title: "Create Item",
    categoryList: categoryList,
  });
});

// Handle item create on POST
exports.itemCreatePost = [
  upload.single("image"),
  body("name", "Name must not be empty.").trim().escape().isLength({ min: 1 }),
  body("description", "").optional({ value: "falsy" }).trim().escape(),
  body("category", "select a category").trim().escape().notEmpty(),
  body("price", "").trim().escape(),
  body("numberInStock", "Quantity must be a greater than 0")
    .trim()
    .escape()
    .isInt({ min: 0 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const errorsArr = errors.array();

    // Check if password is correct
    let passIsValid = true;
    if (req.body.password != process.env.ADMIN_PASSWORD) {
      passIsValid = false;
      errorsArr.push({ msg: "Incorrect password" });
    }
    // Create Item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      image: req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : { data: null, contentType: null },
    });
    if (errors.isEmpty() && passIsValid) {
      // there are no errors, so we can save the item
      await item.save();
      res.redirect("/inventory/item/" + item._id);
    } else {
      // there are errors, so render form again
      const categoryList = await Category.find();
      res.render("itemForm", {
        title: "Create Item",
        categoryList: categoryList,
        item: item,
        errors: errorsArr,
      });
    }
  }),
];

// Handle item update on GET
exports.itemUpdateGet = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find();
  const item = await Item.findById(req.params.id);
  res.render("itemForm", {
    title: "Update Item",
    categoryList: categoryList,
    item: item,
  });
});

// Handle item update on POST
exports.itemUpdatePost = [
  upload.single("image"),
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().escape().isLength({ min: 1 }),
  body("description", "").optional({ value: "falsy" }).trim().escape(),
  body("category", "select a category").trim().escape().notEmpty(),
  body("price", "").trim().escape(),
  body("numberInStock", "Quantity must be a greater than 0")
    .trim()
    .escape()
    .isInt({ min: 0 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const errorsArr = errors.array();

    // Check if password is correct
    let passIsValid = true;
    if (req.body.password != process.env.ADMIN_PASSWORD) {
      passIsValid = false;
      errorsArr.push({ msg: "Incorrect password" });
    }
    // Create Item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      // Don't overwrite image data if the user forgot to upload an image
      ...(req.file
        ? { image: { data: req.file.buffer, contentType: req.file.mimetype } }
        : {}),
      _id: req.params.id, // this is required, or a new ID will be assigned!
    });
    if (errors.isEmpty() && passIsValid) {
      // there are no errors, so we can save the item
      await Item.findByIdAndUpdate(req.params.id, item);

      res.redirect("/inventory/item/" + req.params.id);
    } else {
      // there are errors, so render form again
      const categoryList = await Category.find();
      res.render("itemForm", {
        title: "Update Item",
        categoryList: categoryList,
        item: item,
        errors: errorsArr,
      });
    }
  }),
];
// Handle item delete on GET
exports.itemDeleteGet = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  const categoryList = await Category.find();
  res.render("itemDelete", {
    item: item,
    categoryList: categoryList,
  });
});

// Handle item delete on Post
exports.itemDeletePost = asyncHandler(async (req, res, next) => {
  // Check if password is correct
  if (req.body.password != process.env.ADMIN_PASSWORD) {
    const categoryList = await Category.find();
    res.render("itemDelete", {
      categoryList: categoryList,
      errors: [{ msg: "Incorrect password" }],
    });
  } else {
    await Item.findByIdAndRemove(req.params.id);
    res.redirect("/inventory/items");
  }
});
