const   mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    creator: {
        type: String,
        // required: True
    },
    section: {
        type: String,
        // required: True
    },
    title: {
        type: String,
        // required: True
    },
    comments: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now 
    },
    lastUserUpdated: {
        type: String,
    },
    lastDateUpdated: {
        type: Date,
        default: Date.now 
    },
})


module.exports = mongoose.model("Post", postSchema);