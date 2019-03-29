const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        methodOverride          = require('method-override'),
        User                    = require('./models/user'),
        Post                    = require('./models/post'),
        Comment                 = require('./models/comment'),
        nodemailer              = require('nodemailer');

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

// Nodemailer Setup
app.post('/register', (req, res) => {
    const output = `
      <h3>Un nuevo miembro se ha inscrito en el MLV:</h3>
      <ul>  
        <li>Name: ${req.body.username}</li>
        <li>Company: ${req.body.nickname}</li>
        <li>Email: ${req.body.firstName}</li>
        <li>Phone: ${req.body.lastName}</li>
        <li>username: ${req.body.username}</li>
        <li>nickname: ${req.body.nickname}</li> 
        <li>firstName: ${req.body.firstName}</li>
        <li>lastName: ${req.body.lastName}</li>
        <li>country: ${req.body.country}</li>
        <li>state: ${req.body.state}</li>
        <li>nacimiento: ${req.body.nacimiento}</li>
        <li>profesion: ${req.body.profesion}</li>
        <li>telefono: ${req.body.telefono}</li>
        <li>redSocial1: ${req.body.redSocial1}</li>
        <li>redSocial2: ${req.body.redSocial2}</li>
        <li>cedula: ${req.body.cedula}</li>
        <li>ideologia: ${req.body.ideologia}</li>
        <li>otras: ${req.body.otras}</li>
      </ul>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.googlemail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'jlpg81@gmail.com', // generated ethereal user
          pass: 'DamnVenezuela'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <jlpg81@gmail.com>', // sender address
        to: 'jlpg81@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('success');
    });
    });


// app.post('/register', function(req, res){
//     User.register(new User({
//         username: req.body.username,
//         nickname: req.body.nickname, 
//         firstName: req.body.firstName, 
//         lastName: req.body.lastName,
//         country: req.body.country,
//         state: req.body.state,
//         nacimiento: req.body.nacimiento,
//         profesion: req.body.profesion,
//         telefono: req.body.telefono,
//         redSocial1: req.body.redSocial1,
//         redSocial2: req.body.redSocial2,
//         cedula: req.body.cedula,
//         ideologia: req.body.ideologia,
//         otras: req.body.otras,
//         }), 
//         req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render('register');
//         }
//         passport.authenticate('local')(req,res, function(){
//             res.redirect('/success');
//         })
//     });
// });

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

app.get('/members', isAdmin, function(req, res){
    User.find({}, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('members', {User});
    })
});

app.get('/members/:id', isAdmin, function(req,res){
    User.findById(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

app.post('/members/:id', isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

// Deleting accounts

app.get('/members/:id/delete', isAdmin, function (req, res){
    User.findById({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('delete', {User});
    })
});

app.post('/members/:id/delete', isAdmin, function (req, res){
    User.findByIdAndDelete({ _id: req.params.id }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('dashboard', { loggedUser : req.user });
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

app.post('/members/:id', isAdmin, function (req, res){
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

app.get('/account', isLoggedIn, function(req, res){
    User.findById(req.user._id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

app.post('/account', isLoggedIn, function(req, res){
    User.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
};

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

// code to check passwords is in: http://jsfiddle.net/aelor/F6sEv/324/


//Server setup
app.listen(PORT, () =>
    console.log(`Server initialized on port: ${PORT}`)
);