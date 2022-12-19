const indexR = require("./indexs")
const usersR = require("./users")
const registerR = require("./register")
const productsR = require("./products")
const cartsR = require("./carts")
const ordersR = require("./orders")
const stripeR = require("./stripe")
const emailR = require("./email")

exports.routesInit = (app) => {
    app.use("/", indexR)
    app.use("/register", registerR)
    app.use("/users", usersR)
    app.use("/products", productsR)
    app.use("/carts", cartsR)
    app.use("/orders", ordersR)
    app.use("/stripe", stripeR)
    app.use("/email", emailR)
}

// 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