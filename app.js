const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        User                    = require('./models/user'),
        Post                    = require('./models/post'),
        Comment                 = require('./models/comment');

var PORT = 3002;

//Mongoose Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/forum3", {
    useMongoClient: true
});

//Express setup
const app = express();
app.set('view engine','ejs');

//Passport setup
app.use(require('express-session')({
    secret:"42",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========
// Routes
//========

app.get('/', function(req, res){
    res.render('home');
});

app.get('/denied', function(req, res){
    res.render('denied');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    User.register(new User({
        username: req.body.username,
        nickname: req.body.nickname, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        country: req.body.country}), 
        req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res, function(){
            res.redirect('/success');
        })
    });
});

app.get('/success', function(req, res){
    res.render('success');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/"
}),function(req, res){
});

// app.get('/dashboard', isLoggedIn, function(req, res){
//     res.send(req.user)
// });

app.get('/dashboard', isLoggedIn, function(req, res){
    res.render('dashboard', { loggedUser : req.user })
});

app.get('/admin', isAdmin, function(req, res){
    res.render('admin', { loggedUser : req.user })
});

app.get('/admin/members', isAdmin, function(req, res){
    User.find({}, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('members', {User});
    })
});

app.get('/admin/members/:id', isAdmin, function(req,res){
    User.findById(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

app.post('/admin/members/:id', isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

app.get('/forum', isUser, function(req, res){
    res.render('forum')
});

app.get('/forum/general', isUser, function(req, res){
    Post.find({}, (err, Post) => {
        User.find({}, (err, User)=> {
            res.render('forum/general', {Post, User})
        })
    })
});

app.get('/forum/general_new', isUser, function(req, res){
    res.render('forum/general_new')
});

app.post('/forum/general_new', isUser, function(req, res){
    Post.create({
        title: req.body.title,
        section: "general",
        creator: req.user.nickname,
        lastUserUpdated: req.user.nickname,
        lastDateUpdated: req.body.lastDateUpdated,
        comments: [{
            userid: req.user.nickname,
            content: req.body.content,
            commentDate: req.body.lastDateUpdated}],
        function (err, Post){
            if (err) {
                res.send(err)
            }}
    }, res.redirect('general'))
});


app.get('/forum/general/:id', isUser, function(req, res){
    Post.findById({ _id: req.params.id }, (err, Post)=>{
        if (err){
            console.log(err)
        }
        res.render('forum/posts', {Post})
    })
});

app.post('/admin/members/:id', isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

app.get('/chat', isUser, function(req, res){
    res.render('chat')
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
};

function isUser(req, res, next){
    if(req.user.level>=0){
        return next();
    }
    res.redirect('/denied')
};

function isAdmin(req, res, next){
    if(req.user.level>=0){
        return next();
    }
    res.redirect('/denied')
};

function isIT(req, res, next){
    if(req.user.level>=0){
        return next();
    }
    res.redirect('/denied')
};
// function authLevel(req, res, next){

// };

// code to check passwords is in: http://jsfiddle.net/aelor/F6sEv/324/

//Server setup
app.listen(PORT, () =>
    console.log(`Server initialized on port: ${PORT}`)
);