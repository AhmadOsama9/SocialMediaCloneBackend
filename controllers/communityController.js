const Community = require("../models/communitiesModel")

const createCommunity = async (req, res) => {
    const {name, description, admins} = req.body;

    try {
        const community = await Community.createCommunity(name, description, admins);
        res.status(200).json({communityId: community._Id});

    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

module.exports = {
    createCommunity,
}