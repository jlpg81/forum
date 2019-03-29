const   express     = require('express'),
        passport    = require('passport'),
        Post        = require('../models/post'),
        Comment     = require('../models/comment'),
        nodemailer  = require('nodemailer'),
        router      = express.Router();

router.get('/', function(req, res){
    res.render('home');
});

router.get('/denied', function(req, res){
    res.render('denied');
});

router.get('/register', function(req, res){
    res.render('register');
});

// Nodemailer Setup
router.post('/register', (req, res) => {
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
          pass: 'ScrewYouGit'  // generated ethereal password
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


// router.post('/register', function(req, res){
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

router.get('/success', function(req, res){
    res.render('success');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/"
}),function(req, res){
});

// app.get('/dashboard', isLoggedIn, function(req, res){
//     res.send(req.user)
// });

router.get('/dashboard', isLoggedIn, function(req, res){
    res.render('dashboard', { loggedUser : req.user })
});

router.get('/admin', isAdmin, function(req, res){
    res.render('admin', { loggedUser : req.user })
});

router.get('/members', isAdmin, function(req, res){
    User.find({}, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('members', {User});
    })
});

router.get('/members/:id', isAdmin, function(req,res){
    User.findById(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

router.post('/members/:id', isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

// Deleting accounts

router.get('/members/:id/delete', isAdmin, function (req, res){
    User.findById({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('delete', {User});
    })
});

router.post('/members/:id/delete', isAdmin, function (req, res){
    User.findByIdAndDelete({ _id: req.params.id }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('dashboard', { loggedUser : req.user });
    })
});

//forum routes were here

router.post('/members/:id', isAdmin, function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

router.get('/chat', isUser, function(req, res){
    res.render('chat')
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
});

router.get('/account', isLoggedIn, function(req, res){
    User.findById(req.user._id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

router.post('/account', isLoggedIn, function(req, res){
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

module.exports = router;