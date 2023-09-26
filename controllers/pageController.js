const Pages = require("../models/pageModel");

const createPage = async (req, res) => {
    const { name, description, userId } = req.body;
    const lowercaseName = name.toLowerCase();

    try {
        const page = await Pages.createPage(lowercaseName, description, userId);
        res.status(200).json(page);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deletePage = async (req, res) => {
    const { name } = req.body;
    const lowercaseName = name.toLowerCase();

    try {
        await Pages.deletePage(lowercaseName);
        res.status(200).json({message: "The page has been deleted"})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getCreatedPosts = async (req, res) => {
    const { name } = req.query;
    const lowercaseName = name.toLowerCase();

    try {
        const results = await Pages.getCreatedPosts(lowercaseName);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPageLikers = async (req, res) => {
    const { name } = req.query;
    const lowercaseName = name.toLowerCase();

    try {
        const pageLikers = await Pages.getPageLikers(lowercaseName);
        res.status(200).json(pageLikers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPage = async (req, res) => {
    const { name } = req.query;
    const lowercaseName = name.toLowerCase();

    try {
        const page = await Pages.getPage(lowercaseName);
        res.status(200).json(page);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPageAdmin = async (req, res) => {
    const {name} = req.query;
    const lowercaseName = name.toLowerCase();

    try {
        const admin = await Pages.getPageAdmin(lowercaseName);
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addLike = async (req, res) => {
    const {name, userId} = req.body;
    const lowercaseName = name.toLowerCase();

    try {
        await Pages.addLike(lowercaseName, userId);
        res.status(200).json({message: "The like has been added Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeLike = async (req, res) => {
    const {name, userId} = req.body;
    const lowercaseName = name.toLowerCase();

    try {
        await Pages.removeLike(lowercaseName, userId);
        res.status(200).json({message: "The like has been removed Successfully"})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}



module.exports = {
    createPage,
    deletePage,
    getCreatedPosts,
    getPageLikers,
    getPage,
    getPageAdmin,
    addLike,
    removeLike,
}