require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");
const communityRoutes = require("./routes/community");


const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/user/", userRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/post/", postRoutes);
app.use("/api/community/", communityRoutes);

mongoose.connect(process.env.MONGO_URL).then(
    () => {
        console.log("Connected to the database");

        app.listen(4000, () => {
            console.log("Server is Listening to port 4000");
        })
    }
).catch((err) => {
    console.error(err);
});