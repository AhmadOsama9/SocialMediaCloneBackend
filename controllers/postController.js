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


module.exports = {
    addPost,
}