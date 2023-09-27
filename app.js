const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

//Importing error controller "error404"
const errorController = require("./controllers/error");

//Importing database
const sequelize = require("./util/database");

//Importing Data Models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

//setting templating engine
app.set("view engine", "ejs");
app.set("views", "views");

//Importing routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//using bodyparser and path
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//middleware to retrive  user from database & move to next middleware("app.use("/admin", adminRoutes)")
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      //sequelized user object which holds data object as well as associated helper methods.
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//Using routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//if page not found
app.use(errorController.get404);

//Setting Relations between different data models.
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//It syncs our data models to the database by creating appropriate tables & relations.
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  }) //create a new user at the app start if no user exists.
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  //create an empty cart for each user at the app start if no cart exists.
  .then((user) => {
    user.getCart().then((cart) => {
      if (cart) {
        return cart;
      }
      return user.createCart();
    });
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// .sync({ force: true })
