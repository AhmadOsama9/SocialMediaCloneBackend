const UsersActivity = require("../models/userActivityModel");

const sendFriendRequest = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        await UsersActivity.sendFriendRequest(userId, otherUserId);
        res.status(200).json({message: "The request has been sent Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const acceptFriendRequest = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        await UsersActivity.acceptFriendRequest(userId, otherUserId);
        res.status(200).json({message: "The request has been accepted Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const cancelRequest = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        await UsersActivity.cancelRequest(userId, otherUserId);
        res.status(200).json({message: "The request has been cancelled Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeFriend = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        await UsersActivity.removeFriend(userId, otherUserId);
        res.status(200).json({message: "That user has been removed from the friends"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPendingRequests = async (req, res) => {
    const { userId } = req.query;
    console.log(userId);

    try {
        const pendingRequests = await UsersActivity.getPendingRequests(userId);
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getAllFriends = async (req, res) => {
    const { userId } = req.query

    try {
        const friends = await UsersActivity.getAllFriends(userId);
        res.status(200).json(friends);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getJoinedCommunities = async (req, res) => {
    const { userId } = req.query;

    try {
        const joinedCommunities = await UsersActivity.getJoinedCommunities(userId);
        res.status(200).json(joinedCommunities);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getFriendRelationshipStatus = async (req, res) => {
    const { userId, otherUserId } = req.query;

    try {
        const relation = await UsersActivity.getFriendRelationshipStatus(userId, otherUserId);
        res.status(200).json({relation: relation});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const declineFriendRequest = async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        await UsersActivity.declineFriendRequest(userId, otherUserId);
        res.status(200).json({message: "The request has been remove Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
    getJoinedCommunities,
    getFriendRelationshipStatus,
    declineFriendRequest,
    cancelRequest,
    getPendingRequests,

}