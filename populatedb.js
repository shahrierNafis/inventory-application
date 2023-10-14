#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/Category");
const Item = require("./models/Item");

const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({
    name: name,
    description: description,
  });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "electronics",
      "consumer electronic products such as home and car stereos, televisions, telephones, and personal computers."
    ),
    categoryCreate(1, "jewelry", "jewelry and watches"),
    categoryCreate(
      2,
      "men's clothing",
      "clothing designed for men, including suits, sportswear, and casual clothing."
    ),
    categoryCreate(
      3,
      "women's clothing",
      "clothing designed for women, including suits, sportswear, and casual clothing."
    ),
  ]);
}

async function itemCreate(name, description, category, price, numberInStock) {
  const item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    numberInStock: numberInStock,
  });
  await item.save();
  console.log(`Added item: ${name}`);
}

async function createItems() {
  const products = await (
    await fetch("https://fakestoreapi.com/products")
  ).json();

  console.log("Adding items");

  await Promise.all(
    products.map((product) => {
      let category;
      switch (product.category) {
        case "electronics":
          category = categories[0];
          break;
        case "jewelery":
          category = categories[1];
          break;
        case "men's clothing":
          category = categories[2];
          break;
        case "women's clothing":
          category = categories[3];
          break;

        default:
          break;
      }
      return itemCreate(
        product.title,
        product.description,
        category,
        product.price,
        product.rating.count
      );
    })
  );
}
