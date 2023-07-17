require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");


const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/user/", userRoutes);

mongoose.connect(MONGO_URL).then(
    () => {
        console.log("Connected to the database");

        app.listen(4000, () => {
            console.log("Server is running on port 4000");
        })
    }
).catch((err) => {
    console.error(err);
});