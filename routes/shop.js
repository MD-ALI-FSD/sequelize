const path = require("path");
const express = require("express");

//importing controller from 'shop.js' file.
const shopController = require("../controllers/shop");

const router = express.Router();

//router to GET(render) index on path "/" using controller "getIndex" from "controller/shop.js"
router.get("/", shopController.getIndex);

//router to GET(render) products on path "/products" using controller "getProducts" from "controller/shop.js"
router.get("/products", shopController.getProducts);

//router to GET(render) a particular product on path "/products/productId" using controller "getProduct" from "controller/shop.js"
router.get("/products/:productId", shopController.getProduct);

//router to GET(render) cart on path "/cart" using controller "getCart" from "controller/shop.js"
router.get("/cart", shopController.getCart);

//router to POST(recive data) on adding product in cart on path "/cart" using controller "postCart" from "controller/shop.js"
router.post("/cart", shopController.postCart);

//Route to delete product from cart
router.post("/cart-delete-item", shopController.postCartDeleteProduct);

//Route to move cart items into orders page
router.post("/create-order", shopController.postOrder);

//router to GET(render) order on path "/order" using controller "getOrder" from "controller/shop.js"
router.get("/orders", shopController.getOrders);

//router to GET(render) checkout on path "/" using controller "getCheckout" from "controller/shop.js"
// router.get("/checkout", shopController.getCheckout);

module.exports = router;
