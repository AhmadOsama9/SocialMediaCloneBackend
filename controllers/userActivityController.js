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

const getReceivedRequests = async (req, res) => {
    const { userId } = req.query;

    try {
        const receivedRequests = await UsersActivity.getReceivedRequests(userId);
        res.status(200).json(receivedRequests);
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

const getUserCommunities = async (req, res) => {
    const { userId } = req.query;

    try {
        const userCommunities = await UsersActivity.getUserCommunities(userId);
        res.status(200).json(userCommunities);
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

const getCreatedPosts = async (req, res) => {
    const { userId } = req.query;

    try {
        const posts = await UsersActivity.getCreatedPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getSharedPosts = async (req, res) => {
    const { userId } = req.query;

    try {
        const posts = await UsersActivity.getSharedPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getFeedPosts = async (req, res) => {
    const { userId, page } = req.query;

    try {
        const posts = await UsersActivity.getFeedPosts(userId, page);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}



module.exports = {
    getCreatedPosts,
    getSharedPosts,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getAllFriends,
    getJoinedCommunities,
    getUserCommunities,
    getFriendRelationshipStatus,
    declineFriendRequest,
    cancelRequest,
    getReceivedRequests,
    getFeedPosts,
}