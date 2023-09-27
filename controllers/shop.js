//Controller for product

//Importing models(Clases) to save and retrive data
const Product = require("../models/product");

//Exporting middleware to be used in "route/shop.js" to render page "/products" to display all products and displays them using template "views/shop/product-list.ejs"
exports.getProducts = (req, res, next) => {
  //findAll method fetches everything(*) from a given table
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/shop.js" to render page "/products/product-id" to display details of a particular product whose id is fetched  using "req.params.productId" and displays it using template "views/shop/product-detail.ejs"
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //fetches data of a particular product from the table.
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
// Product.findOne({
//   where: {
//     id: prodId;
//   }
// })

//Exporting middleware to be used in "route/shop.js" to render page "/shop/index" to display all products and displays them using template "views/shop/product-list.ejs"
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/shop.js" to render page "/cart" to display items of the cart and displays them using template "views/shop/cart.ejs".
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/shop.js" to redirect to page "/cart" after adding items to  the cart using methods of sequelize and displays them using template "views/shop/cart.ejs".
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      //checking if product available in the cart
      if (products.length > 0) {
        product = products[0];
      }
      //If product already in cart
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      //if product not available in the cart
      return Product.findByPk(prodId);
    }) //add new product in the cart or increase its quantity
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/shop.js" to redirect to page "/cart" after deleting items from  the cart using sequelized methods displays them using template "views/shop/cart.ejs".
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/shop.js" to redirect to page "/orders" after moving  items from  the cart into orders using sequelized methods and displays them using template "views/shop/cart.ejs".
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      //emptying the cart after moving them in orders
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

//Exporting middleware to be used in "route/shop.js" to redirect to page "shop/orders" to display orders fetched  using sequelized methods and then displays them using template "views/shop/cart.ejs".
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

//not being used
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
