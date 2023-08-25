const express = require("express");
const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/bridge", (req, res) => {
    const body = req.body;
    console.log(`body: `, body);
    res.status(201).json(req.body);
});

app.listen(3000, () => {
    console.log("Start server at port 3000.");
});
