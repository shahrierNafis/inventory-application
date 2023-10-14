const express = require("express");
const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");
const router = express.Router();

const Category = require("../models/Category");
const Item = require("../models/Item");

// GET catalog home page.
router.get("/", async function (req, res, next) {
  const categoryList = await Category.find();
  const itemList = await Item.find();
  console.log(itemList, categoryList);
  res.render("index", {
    title: "Inventory Management System",
    categoryList: categoryList,
    itemList: itemList,
  });
});
// GET request for category list
router.get("/categories", categoryController.categoryList);

// GET request to create a new category
router.get("/category/new", categoryController.categoryCreateGet);

// POST request to create a new category
router.post("/category/new", categoryController.categoryCreatePost);

// GET request to update a category
router.get("/category/:id/update", categoryController.categoryUpdateGet);

// POST request to update a category
router.post("/category/:id/update", categoryController.categoryUpdatePost);

// GET request to delete a category
router.get("/category/:id/delete", categoryController.categoryDeleteGet);

// POST request to delete a category
router.post("/category/:id/delete", categoryController.categoryDeletePost);

// GET request for one category
router.get("/category/:id", categoryController.items);

// GET request for creating a new item. NOTE This must come before routes that display items in the list
router.get("/item/new", itemController.itemCreateGet);

// POST request for creating a new item
router.post("/item/new", itemController.itemCreatePost);

// GET request to delete an item
router.get("/item/:id/delete", itemController.itemDeleteGet);

// POST request to delete an item
router.post("/item/:id/delete", itemController.itemDeletePost);

// GET request to update an item
router.get("/item/:id/update", itemController.itemUpdateGet);

// POST request to update an item
router.post("/item/:id/update", itemController.itemUpdatePost);

// GET request for one item
router.get("/item/:id", itemController.item);

// GET request for list of all items
router.get("/items", itemController.items);

// Export the router
module.exports = router;
