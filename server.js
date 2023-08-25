const smartcontract = require("./smartcontract");
const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(smartcontract.test());
});

app.post("/bridge", (req, res) => {
    const { wallet_address, source, destination, amount } = { ...req.body };
    smartcontract.bridge(wallet_address, source, destination, amount);
    res.status(201).json(req.body);
});

app.listen(3000, () => {
    console.log("Start server at port 3000.");
});
