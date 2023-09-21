require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const http = require("http");
const Server = require("socket.io").Server;

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");
const communityRoutes = require("./routes/community");
const chatRoutes = require("./routes/chat");
const userActivityRoutes = require("./routes/userActivity");
const pageRoutes = require("./routes/page");
const otpRoutes = require("./routes/otp");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.json());

app.use(cors({
    origin: [
      "https://socialmediaclone-s3lg.onrender.com",
      "http://localhost:5173",
    ],
}));

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))
  

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/user/", userRoutes);
app.use("/api/user/", profileRoutes);
app.use("/api/post/", postRoutes);
app.use("/api/community/", communityRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/user/", userActivityRoutes);
app.use("/api/page/", pageRoutes);
app.use("/api/otp/", otpRoutes);

// Redirect all unknown routes to the home page
app.all('*', (req, res) => {
    res.redirect("https://socialmediaclone-s3lg.onrender.com");
});


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
      console.log("Connected to the database");

      server.listen(5000, () => {
        console.log("The websocket server is running on port 5000");
      })

      app.listen(4000, () => {
          console.log("Server is Listening to port 4000");
      })
    }
).catch((err) => {
    console.error(err);
});

module.exports = io;