const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        methodOverride          = require('method-override'),
        User                    = require('./models/user'),
        Post                    = require('./models/post'),
        Comment                 = require('./models/comment');

var PORT = 3002;

//Mongoose Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/forum3", { useNewUrlParser: true });

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

//Other setup
app.use(methodOverride("_method"));
app.use(express.static("public"));

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

///////////////////////////////////////////////////////////////////////
//      FFFFF    OOO    RRRRR   UU  UU   MM       MM
//      FF      OO OO   RR RR   UU  UU   MM MM MM MM
//      FFFF    OO OO   RRR     UU  UU   MM   MM  MM
//      FF       OOO    RR RR    UUUU    MM       MM
/////////////////////////////////////////////////////////////////////////

app.get('/forum', isUser, function(req, res){
    res.render('forum')
});

// Main forum routes

app.get('/forum/:section', isUser, function(req, res){
    Post.find({ section: req.params.section}, (err, Post) => {
        res.render('forum/'+req.params.section, {Post, User})
    })
});

// Route creating new posts


app.get('/forum/:section/new', isUser, function(req, res){
    res.render('forum/new', {Section: capitalizeFirstLetter(req.params.section), section: req.params.section })
});

// routes to send new post info to server

app.post('/forum/:section/new', isUser, function(req, res){
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

// este codigo por alguna razon me da un error al entrar a forum/:section...
//{ CastError: Cast to ObjectId failed for value "mlv.js" at path "_id" for model "Post"
// app.get('/forum/:section/:id', isUser, function(req, res){
//     Post.find({ _id: req.params.id, section: req.params.section }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

app.get('/forum/:section/:id', isUser, function(req, res){
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

// app.get('/forum/general/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/activismo/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/libertarimo/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/formacion/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/proyectos/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/voluntariado/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/sugerencias/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/intranet/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// app.get('/forum/offtopic/:id', isUser, function(req, res){
//     Post.findById({ _id: req.params.id }, (err, Post)=>{
//         if (err){
//             console.log(err)
//         } else {
//             Comment.find({ parent: req.params.id }, (err, Comment)=>{
//                 res.render('forum/posts', {Post, Comment})
//             })
//         }
//     })
// });

// Route to post a new comment

app.post('/forum/:section/:id', isUser, function(req, res){
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

///////////////////////////////////// End of forum routes

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// code to check passwords is in: http://jsfiddle.net/aelor/F6sEv/324/


//Server setup
app.listen(PORT, () =>
    console.log(`Server initialized on port: ${PORT}`)
);