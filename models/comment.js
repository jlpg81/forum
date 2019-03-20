const   mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userid: {
        type: String,
        // required: True
    },
    content: {
        type: String,
        // required: True
    },
    commentDate: {
        type: Date,
        default: Date.now 
    },
})

module.exports = mongoose.model("Comment", commentSchema);
