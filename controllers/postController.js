const Posts = require("../models/postModel");

const addPost = async (req, res) => {
    const {content, owner, community} = req.body;

    try {
        const post = await Posts.addPost(content, owner, community);

        res.status(200).json({postId: post._postId});
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
        res.status(200).json({message: "The post has been deleted succesfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    addPost,
    updatePost,
    deletePost,
}