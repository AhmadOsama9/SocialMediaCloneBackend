const UsersActivity = require("../models/chatModel");

const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        await UsersActivity.sendFriendRequest(senderId, receiverId);
        res.status(200).json({message: "The request has been sent Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        await UsersActivity.acceptFriendRequest(userId, friendId);
        res.status(200).json({message: "The request has been accepted Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}