const Pages = require("../models/pageModel");

const createPage = async (req, res) => {
    const { name, description, userId } = req.body;

    try {
        await Pages.createPage(name, description, userId);
        res.status(200).json({message: "The Page has been created"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deletePage = async (req, res) => {
    const { name } = req.body;

    try {
        await Pages.deletePage(name);
        res.status(200).json({message: "The page has been deleted"})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getCreatedPosts = async (req, res) => {
    const { name } = req.query;

    try {
        const results = await Pages.getCreatedPosts(name);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getPageLikers = async (req, res) => {
    const { name } = req.query;

    try {
        const pageLikers = await Pages.getPageLikers(name);
        res.status(200).json(pageLikers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


module.exporst = {
    createPage,
    deletePage,
    getCreatedPosts,
    getPageLikers,
}