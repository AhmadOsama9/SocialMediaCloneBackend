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

const addMember = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.addMember(userId, communityId);
        res.status(200).json({message: "The user has been added Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const removeMember = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.removeMember(userId, communityId);
        res.status(200).json({message: "The member has removed Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const acceptMemberRequest = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.acceptMemberRequest(userId, communityId);
        res.status(200).json({message: "The member has been accepted Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const makeMemberAdmin = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.makeMemberAdmin(userId, commmunityId);
        res.status(200).json({message: "the user have become an admin successfully"});
    }  catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    createCommunity,
    addMember,
    removeMember,
    acceptMemberRequest,
    makeMemberAdmin,
}