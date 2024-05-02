require("dotenv").config()
const PORT=process.env.PORT||2000;
const express = require("express");
const app = express ();
const cors = require("cors")
const bearetToken = require("express-bearer-token");

app.use(cors());
app.use(express.json());
app.use(bearetToken());

app.get("/", (req, res) => {
    return res.status(200).send('API Running');
});

// #define ROUTER
const {usersRouter } = require("./routers");
app.use("/account", usersRouter);

app.listen(PORT, () => {
    console.log("API RUNNING", PORT);
});