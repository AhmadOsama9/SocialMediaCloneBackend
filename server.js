require("dotenv").config();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const http = require("http");
const Server = require("socket.io").Server;
const Chat = require("./models/chatModel");

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

const swaggerOptions = {
  swaggerDefinition: {
      openapi: "3.0.0",
      info: {
          title: "sociaMediaCloneBackendDocumentation",
          version: "1.0.0",
          description: "Documentation for your APIs",
      },
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log(`User connected via WebSocket: ${socket.id}`);

  // Event listener for joining a chat room
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat room: ${chatId}`);
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat room: ${chatId}`)
  })

  // Event listener for chat messages
  socket.on("chat-message", async (data) => {
    console.log("It call the chat-message, data is: ", data);
    const { chatId, message, userId } = data;

    try {
        const newMessage = await Chat.sendMessageByChatId(chatId, userId, message);

        // Broadcast the new message to the chat room
        socket.to(chatId).emit("chat-message", newMessage);
        console.log("The socket.to is being called");
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
  });

  socket.on("typing", (data) => {
    const { chatId, userId } = data; 
    socket.to(chatId).emit("typing", userId);
  })

  socket.on("stop typing", (data) => {
    const {chatId, userId } = data;
    socket.to(chatId).emit("stop typing", userId);
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
      console.log("Connected to the database");
    }
).catch((err) => {
    console.error(err);
});

server.listen(3000, () => {
  console.log("The websocket server is running on port 3000");
})

