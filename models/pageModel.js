const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pageSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
    pagelikers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
});


pageSchema.statics.createPage = async function (name, description, userId) {
    const UsersActivity = require("./userActivityModel");

    const userActivity = await UsersActivity.findOne({ user: userId });
    if (!userActivity) {
        throw Error("User Activity not found");
    }

    const newPage = await this.create({
        name, 
        description,
        admin: userId,
    });
    if (!newPage) {
        throw Error("Failed to create the page");
    }

    userActivity.createdPages.push(newPage._id);
    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
    }

}

pageSchema.statics.deletePage = async function (name) {
    const UsersActivity = require("./userActivityModel");
    
    const page = await this.findOne({ name });
    if (!page) {
        throw Error("Page not found");
    }

    const userId = page.admin;
    const userActivity = await UsersActivity.findOne({ user: userId });
    if (!userActivity) {
        throw Error("User Activity not found");
    }

    userActivity.createdPages.pull(page._id);
    const updatedUserActivity = await userActivity.save();
    if (!updatedUserActivity) {
        throw Error("Failed to save the updated user activity");
    }

    for (const userId of page.pagelikers) {
        userActivity = await UsersActivity.findById(userId);
        if (!userActivity) {
            throw Error("The page liker activity not found");
        }
        userActivity.likedPages.pull(page);
        updatedUserActivity = userActivity.save();
        if (!updatedUserActivity) {
            throw Error("Failed to save the updated liker activity");
        }
    }
}

pageSchema.statics.getCreatedPosts = async function (name) {
    const Post = require("./postModel");

    const page = await this.findOne({name});
    if (!page) {
        throw Error("Page not found");
    }

    const pagePosts = page.posts;
    const results = [];

    for (const postId of pagePosts) {
        const post = await Post.findById(postId);
        if (!post) {
            throw Error("Cannot find the post");
        }

        results.push({
            nickname: post.nickname,
            header: post.header,
            content: post.content,
            postId: post._id,
        });
    }

    return results;

}
pageSchema.statics.getPageLikers = async function (name) {
    const page = await this.findOne({ name })

    if (!page) {
        throw Error("Page not found");
    }

    
    console.log("The PageLikers are: ", page.pagelikers);
    console.log("The page is: ", page);

    return page.pagelikers;
}


pageSchema.statics.getPage = async function (name) {
    const page = await this.findOne({name});
    if (!page) {
        throw Error("Page not found");
    }

    return page;
}

pageSchema.statics.getPageAdmin = async function (name) {
    const page = await this.findOne({name});
    if (!page) {
        throw Error("Page not found");
    }

    return page.admin;
}

pageSchema.statics.addLike = async function (name, userId) {
    const page = await this.findOne({name});
    if (!page) {
        throw Error("Page not found");
    }

    page.pageLikers.push(userId);
    const updatedPage = await page.save();
    if (!updatedPage) {
        throw Error("Failed to save the updated Page");
    }
}

pageSchema.statics.removeLike = async function (name, userId) {
    const page = await this.findOne({name});
    if (!page) {
        throw Error("Page not found");
    }

    if (!page.pageLikers.include(userId)) {
        throw Error("That user is not liking the page");
    }

    page.pageLikers.pull(userId);
    const updatedPage = await page.save();
    if (!updatedPage) {
        throw Error("Failed to save the updated Page");
    }
}

module.exports = mongoose.model("Pages", pageSchema);