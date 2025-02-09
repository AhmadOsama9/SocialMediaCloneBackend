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
    const {header, content, owner, communityId} = req.body;

    try {
        await Posts.addPost(header, content, owner, communityId);
        res.status(200).json({message: "The post has been created Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const createPagePost = async (req, res) => {
    const { pageName, header, content } = req.body;

    try {
        await Posts.createPagePost(pageName, header, content);
        res.status(200).json({message: "The post has been created Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updatePost = async (req, res) => {
    const { postId, header, content } = req.body; 

    try {
        const updatedPost = await Posts.updatePost(postId, header, content);
        res.status(200).json({message: "The post has been updated Successfully"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const deleteCommunityPost = async (req, res) => {
    const { postId } = req.body;

    try {
        await Posts.deleteCommunityPost(postId);
        res.status(200).json({message: "The post has been deleted succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deleteUserPost = async (req, res) => {
    const { postId } = req.body;

    try {
        await Posts.deleteUserPost(postId);
        res.status(200).json({message: "The post has been deleted successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deletePagePost = async (req, res) => {
    const { pageName, postId } = req.body;

    try {
        await Posts.deletePagePost(pageName, postId);
        res.status(200).json({message: "The post has been deleted Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addReaction = async (req, res) => {
    const {nickname, postId, reactionType} = req.body;

    try {
        await Posts.addReaction(nickname, postId, reactionType);
        res.status(200).json({message: "The reaction has been added Successfuly"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateReaction = async (req, res) => {
    const {nickname, postId, reactionType} = req.body;

    try{
        await Posts.updateReaction(nickname, postId, reactionType);
        res.status(200).json({message: "The reaction has been updated Successfully"})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeReaction = async (req, res) => {
    const {userId, postId} = req.body;

    try {
        await Posts.deleteReaction(userId, postId);
        res.status(200).json({message: "The reaction has been deleted Succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addComment = async (req, res) => {
    const { userId, postId, content } = req.body;

    try {
        const commentId = await Posts.addComment( userId, postId, content);
        res.status(200).json({message: "The comment has been added Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const updateComment = async (req, res) => {
    const { content, commentId } = req.body;
    
    try {
        await Posts.updateComment(content, commentId);
        res.status(200).json({message: "The comment has been updated Succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeComment = async (req, res) => {
    const { postId, commentId } = req.body;

    try {
        await Posts.deleteComment(postId, commentId);
        res.status(200).json({message: "The Comment has been deleted successfully"});
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

const getPostReactions = async (req, res) => {
    const {postId} = req.query;

    try {
        const results = await Posts.getPostReactions(postId);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPostComments = async (req, res) => {
    const {postId} = req.query;

    try {
        const results = await Posts.getPostComments(postId);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPostSharesCount = async (req, res) => {
    const {postId} = req.query;

    try {
        const results = await Posts.getPostShares(postId);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    createPost,
    addPost,
    createPagePost,
    updatePost,
    deleteCommunityPost,
    deleteUserPost,
    deletePagePost,
    addReaction,
    updateReaction,
    removeReaction,
    addComment,
    updateComment,
    removeComment,
    addShare,
    removeShare,
    getPostReactions,
    getPostComments,
    getPostSharesCount,
}