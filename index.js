const express = require("express");
const path = require("path")
const http = require("http")
const cors = require("cors")
require("dotenv").config()

const { routesInit } = require("./routes/configRoutes");
require("./db/mongoconnect");

const app = express();

app.use(cors());

app.use(express.json());

app.use( express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

routesInit(app);

const server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
    console.log("server is running...")
});