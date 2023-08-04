const Posts = require("../models/postModel");


const createPost = async (req, res) => {
    const {header, content, owner} = req.body;

    try {
        await Posts.createPost(header, content, owner);
        res.status(200).json({message: "The post has been created Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

const addPost = async (req, res) => {
    const {header, content, owner, community} = req.body;

    try {
        await Posts.addPost(header, content, owner, community);
        res.status(200).json({message: "The post has been created Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPosts = async (req, res) => {
    const {userId} = req.query;

    try {
        const posts = await Posts.getPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updatePost = async (req, res) => {
    const { postId, content, community } = req.body; 

    try {
        const updatedPost = await Posts.updatePost(postId, content, community);
        res.status(200).json({postId: updatedPost._postId});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const deletePost = async (req, res) => {
    const { postId } = req.body;

    try {
        await Posts.deletePost(postId);
        res.status(200).json({message: "The post has been deleted succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addReaction = async (req, res) => {
    const {userId, postId, reactionType} = req.body;

    try {
        await Posts.addReaction(userId, postId, reactionType);
        res.status(200).json({message: "The reaction has been added Successfuly"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateReaction = async (req, res) => {
    const {userId, postId, reactionType} = req.body;

    try{
        await Posts.updateReaction(userId, postId, reactionType);
        res.status(200).json({message: "The reaction has been updated Successfully"})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeReaction = async (req, res) => {
    const {userId, postId} = req.body;

    try {
        await Posts.removeReaction(userId, postId);
        res.status(200).json({message: "The reaction has been remove Succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addComment = async (req, res) => {
    const { userId, postId, content} = req.body;

    try {
        await Posts.addComment( userId, postId, content);
        res.status(200).json({message: "The comment has been added succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateComment = async (req, res) => {
    const { userId, postId, content } = req.body;
    
    try {
        await Posts.updateComment( userId, postId, content);
        res.status(200).json({message: "The comment has been updated Succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeComment = async (req, res) => {
    const { userId, postId } = req.body;

    try {
        await Posts.removeComment(userId, postId);
        res.status(200).json({message: "The Comment has been remove successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addShare = async (req, res) => {
    const { userId, postId } = req.body;

    try {
        await Posts.addShare(userId, postId);
        res.status(200).json({message: "The share was successful"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeShare = async (req, res) => {
    const { userId, postId } = req.body;

    try {
        await Posts.removeShare(userId, postId);
        res.status(200).json({message: "The share has been remove successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    createPost,
    addPost,
    getPosts,
    updatePost,
    deletePost,
    addReaction,
    updateReaction,
    removeReaction,
    addComment,
    updateComment,
    removeComment,
    addShare,
    removeShare,
}