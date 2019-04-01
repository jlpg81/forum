const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        methodOverride          = require('method-override'),
        User                    = require('../models/user'),
        mainRoutes              = require('../routes/mainRoutes'),
        registryRoutes          = require('../routes/registry'),
        adminRoutes             = require('../routes/adminRoutes'),
        security    = require('../controllers/securityFunctions'),
        nodemailer  = require('nodemailer'),
        forumRoutes             = require('../routes/forumRoutes');


// router.get('/admin', security.isAdmin, function(req, res){
//     res.render('admin', { loggedUser : req.user })
// });

router.get('/members', [security.isLoggedIn, security.isAdmin], function(req, res){
    User.find({}, (err, User) => {
        if (err) {
            res.send('err');
        }
        res.render('members', {User});
    })
});

router.get('/members/:id', [security.isLoggedIn,security.isAdmin], function(req,res){
    User.findById(req.params.id, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {User} )});
});

router.post('/members/:id', [security.isLoggedIn,security.isAdmin], function (req, res){
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
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
            </ul>`;
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
                subject: 'Perfil cambiado - Admin', // Subject line
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                res.render('updated');
        })
    })
});

// Deleting accounts

router.get('/members/:id/delete', [security.isLoggedIn,security.isAdmin], function (req, res){
    User.findById({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('delete', {User});
    })
});

router.post('/members/:id/delete', [security.isLoggedIn,security.isAdmin], function (req, res){
    User.findByIdAndDelete({ _id: req.params.id }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('dashboard', { loggedUser : req.user });
    })
});

//forum routes were here

router.post('/members/:id', [security.isLoggedIn,security.isAdmin], function (req, res){
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, User) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
});

module.exports = router;