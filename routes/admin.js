const path = require("path");
const express = require("express");

const router = express.Router();

//importing controllers from 'products.js' file.
const adminController = require("../controllers/admin");

//router to GET(render) add-products on path "/add-product" using controller "getAddProduct" from "controlller/admin.js"
router.get("/add-product", adminController.getAddProduct);

//router to GET(render) add-products on path "/add-product" using controller "getAddProduct" from "controlller/admin.js"
router.get("/products", adminController.getProducts);

//router to GET(render) add-products on path "/add-product" using controller "getAddProduct" from "controlller/admin.js"
router.post("/add-product", adminController.postAddProduct);

//router to GET(render) a particular product on path "/products/productId" using controller "getProduct" from "controller/shop.js"
router.get("/edit-product/:productId", adminController.getEditProduct);

//rendering after editing
router.post("/edit-product", adminController.postEditProduct);

//handling delete product
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
