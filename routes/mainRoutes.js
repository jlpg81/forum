const   express     = require('express'),
        passport    = require('passport'),
        User        = require('../models/user'),
        security    = require('../controllers/securityFunctions'),
        nodemailer  = require('nodemailer'),
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

router.get('/chat', [security.isLoggedIn,security.isUser], function(req, res){
    res.render('chat')
});

router.get('/account', security.isLoggedIn, function(req, res){
    User.findById(req.user._id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )
    });
});

router.post('/account', security.isLoggedIn, function(req, res){
    User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        var output = `
            <h3>Un miembro ha cambiado los datos de su cuenta:</h3>
            <p>Cambiado por:  ${req.user._id} / ${req.user.username} </p>
            <ul>
                <li>username: ${req.body.username}</li>
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
                <li>nivel: ${req.body.level}</li>
            </ul>  `;
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.ionos.es',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'it@mlv-intranet.org', // generated ethereal user
                    pass: 'Qwer1234.'  // generated ethereal password
                },
                tls:{
                rejectUnauthorized:false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"MLV Intranet Admin" <it@mlv-intranet.org>', // sender address
                to: ['jlpg81@gmail.com','movi.libertariovzla@gmail.com'], // list of receivers
                subject: 'Perfil cambiado - Usuario', // Subject line
                html: output // html body
            };
          // send mail with defined transport object
             transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                res.render('updated');
            });
    })
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
});

module.exports = router;