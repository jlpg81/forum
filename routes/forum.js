const   express     = require('express'),
        Post        = require('../models/post'),
        Comment     = require('../models/comment'),
        User        = require('../models/user'),
        router      = express.Router();

router.get('/forum', isUser, function(req, res){
    res.render('forum')
});

// Main forum routes

router.get('/forum/:section', isUser, function(req, res){
    Post.find({ section: req.params.section}, (err, Post) => {
        res.render('forum/'+req.params.section, {Post, User})
    })
});

// Route creating new posts


router.get('/forum/:section/new', isUser, function(req, res){
    res.render('forum/new', {Section: capitalizeFirstLetter(req.params.section), section: req.params.section })
});

// routes to send new post info to server

router.post('/forum/:section/new', isUser, function(req, res){
    Post.create({
        title: req.body.title,
        section: req.params.section,
        creator: req.user.nickname,
        // lastUserUpdated: req.user.nickname,
        comment: req.body.comment,
        children: [],
        function (err, Post){if (err) {res.send(err)} else {} }
    }, res.redirect('/forum/'+req.params.section))
});

// Route to view posts

router.get('/forum/:section/:id', isUser, function(req, res){
    Post.findById({ _id: req.params.id }, (err, Post)=>{
        if (err){
            console.log(err)
        } else {
            Comment.find({ parent: req.params.id }, (err, Comment)=>{
                res.render('forum/posts', {Post, Comment, Section: capitalizeFirstLetter(req.params.section), section: req.params.section})
            })
        }
    })
});

// Route to post a new comment

router.post('/forum/:section/:id', isUser, function(req, res){
    Comment.create({
        comment: req.body.comment,
        creator: req.user.nickname,
        parent: req.params.id,
        }, function(err, comment){
        Post.findById({_id: req.params.id}, function(err,foundPost){
            foundPost.children.push(comment._id);
            foundPost.save(function(err,data){
                if (err){
                    console.log(err)
                } else {
                    res.redirect('back')
                }
            })
        })
    })
});

function isUser(req, res, next){
    if(req.user.level>=1){
        return next();
    }
    res.redirect('/denied')
};

function isAdmin(req, res, next){
    if(req.user.level>=2){
        return next();
    }
    res.redirect('/denied')
};

function isIT(req, res, next){
    if(req.user.level>=3){
        return next();
    }
    res.redirect('/denied')
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;