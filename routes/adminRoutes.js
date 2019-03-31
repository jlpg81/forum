const   express     = require('express'),
        User        = require('../models/user'),
        security    = require('../controllers/securityFunctions')
        router      = express.Router();


router.get('/admin', security.isAdmin, function(req, res){
    res.render('admin', { loggedUser : req.user })
});

router.get('/members', security.isAdmin, function(req, res){
    User.find({}, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('members', {User});
    })
});

router.get('/members/:id', security.isAdmin, function(req,res){
    User.findById(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

router.post('/members/:id', security.isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

// Deleting accounts

router.get('/members/:id/delete', security.isAdmin, function (req, res){
    User.findById({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('delete', {User});
    })
});

router.post('/members/:id/delete', security.isAdmin, function (req, res){
    User.findByIdAndDelete({ _id: req.params.id }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('dashboard', { loggedUser : req.user });
    })
});

//forum routes were here

router.post('/members/:id', security.isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

module.exports = router;