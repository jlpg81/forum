const   mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    creator: {
        type: String,
        // required: True
    },
    comment: {
        type: String,
        // required: True
    },
    children: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    commentDate: {
        type: Date,
        default: Date.now 
    },
})

module.exports = mongoose.model("Comment", commentSchema);
