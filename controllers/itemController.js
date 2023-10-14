const Category = require("../models/Category");
const Item = require("../models/Item");

exports.items = async (req, res, next) => {
  const items = await Item.find();
  res.render("items", {
    items: items,
  });
};

// Handle item create on GET
exports.itemCreateGet = (req, res, next) => {
  res.render("itemForm");
};

// Handle item create on POST
exports.itemCreatePost = async (req, res, next) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    numberInStock: req.body.numberInStock,
  });
  await item.save();
  res.redirect("/catalog/items");
};

// Handle item update on GET
exports.itemUpdateGet = async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  res.render("itemForm", {
    item: item,
  });
};

// Handle item update on POST
exports.itemUpdatePost = async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  item.name = req.body.name;
  item.description = req.body.description;
  item.category = req.body.category;
  item.price = req.body.price;
  item.numberInStock = req.body.numberInStock;
  await item.save();
  res.redirect("/catalog/items");
};

// Handle item delete on GET
exports.itemDeleteGet = async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  res.render("itemDelete", {
    item: item,
  });
};

// Handle item delete on Post
exports.itemDeletePost = async (req, res, next) => {
  await Item.findByIdAndRemove(req.params.id);
  res.redirect("/catalog/items");
};
