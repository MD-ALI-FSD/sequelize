//Importing "Product" model to save and retrive data from the products table in the database
const Product = require("../models/product");

//Exporting middleware to be used in "route/admin.js" to render(get) add-products page on path "/add-product using template "views/admin/edit-product.ejs".
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//Exporting middleware to be used in "route/admin.js" to POST DATA from path "/admin/add-product" and create a new product object using "models/product.js/Product.save".
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Using "Product" Modal to add the posted data(new product) in the products table of our database.
  //"req.user" is an sequelized user object which holds both data object as well as associated helper methods and here it is used to create a new product with that user associated with it.
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log("created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

//Exporting middleware to be used in "route/admin.js" to render page "/admin/edit-product" with data of that product using "query-params"  and displays it using template "views/admin/edit-product.ejs"
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  //fetching a single data from "product" table using prodId
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/admin.js" to render page "/admin/products" with  edited product and displays it using template "views/admin/product.ejs"
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  //fetching that particular product from "product" table using prodId and updating it.
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      //saves the data in the table
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT SUCCESFULLY!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/admin.js" to render page "/admin/products" to render all products and displays them using template "views/admin/edit-product.ejs"
exports.getProducts = (req, res, next) => {
  //fetching all data from the "product" table.
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "router/admin.js" to delete a product.
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //fetching a single data from "product" table using prodId
  Product.findByPk(prodId)
    .then((product) => {
      //deletes the product's data from the table.
      return product.destroy();
    })
    .then((result) => {
      console.log("Deleted Product Successsfully");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
