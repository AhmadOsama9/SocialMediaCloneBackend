const Community = require("../models/communitiesModel")

const createCommunity = async (req, res) => {
    const {name, description, userId} = req.body;

    try {
        const community = await Community.createCommunity(name, description, userId);
        res.status(200).json({message: "The community has been created Sucessfully"});

    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

const removeCommunity = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        const community = await Community.removeCommunity(userId, communityId);
        res.status(200).json({message: "The community has been removed Successfully"});
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

const addToRequests = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.addToRequests(userId, communityId);
        res.status(200).json({message: "The request has been added Successfully"});
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
        await Community.makeMemberAdmin(userId, communityId);
        res.status(200).json({message: "the user have become an admin successfully"});
    }  catch (error) {
        res.status(400).json({error: error.message});
    }
}

const searchCommunityByName = async (req, res) => {
    const { name } = req.query;

    try {
        const community = await Community.searchCommunityByName(name);
        res.status(200).json(community);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.getAllCommunities();
        res.status(200).json(communities);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const declineMemberRequest = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.declineMemberRequest(userId, communityId);
        res.status(200).json({message: "The request has been declined Successsfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
const cancelRequest = async (req, res) => {
    const { userId, communityId } = req.body;

    try {
        await Community.cancelRequest(userId, communityId);
        res.status(200).json({message: "The request has been cancelled Successsfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getRelation = async (req, res) => {
    const { userId, communityId } = req.query;

    try {
        const relation = await Community.getRelation(userId, communityId);
        res.status(200).json({relation: relation});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getMembers = async (req, res) => {
    const {communityId} = req.query;
    
    try {
        const result = await Community.getMembers(communityId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getMembershipRequests = async (req, res) => {
    const {communityId} = req.query;

    try {
        const result = await Community.getMembershipRequests(communityId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const leaveCommunity = async (req, res) => {
    const {userId, communityId} = req.query;

    try {
        await Community.leaveCommunity(userId, communityId);
        res.status(200).json({message: "The user have left the community Successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}



module.exports = {
    createCommunity,
    removeCommunity,
    removeMember,
    addToRequests,
    acceptMemberRequest,
    makeMemberAdmin,
    searchCommunityByName,
    getAllCommunities,
    declineMemberRequest,
    cancelRequest,
    getRelation,
    getMembers,
    getMembershipRequests,
    leaveCommunity,
}