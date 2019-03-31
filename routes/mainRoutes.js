const   express     = require('express'),
        passport    = require('passport'),
        User        = require('../models/user'),
        security    = require('../controllers/securityFunctions')
        router      = express.Router();

router.get('/', function(req, res){
    res.render('home');
});

router.get('/denied', function(req, res){
    res.render('denied');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/"
}),function(req, res){
});

router.get('/dashboard', security.isLoggedIn, function(req, res){
    res.render('dashboard', { loggedUser : req.user })
});

router.get('/chat', security.isUser, function(req, res){
    res.render('chat')
});

router.get('/account', security.isLoggedIn, function(req, res){
    User.findById(req.user._id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

router.post('/account', security.isLoggedIn, function(req, res){
    User.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
});

module.exports = router;