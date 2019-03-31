const   express     = require('express'),
        passport    = require('passport'),
        nodemailer  = require('nodemailer'),
        User        = require('../models/user'),
        security    = require('../controllers/securityFunctions'),
        router      = express.Router();

router.get('/register', function(req, res){
    res.render('register');
});

// Nodemailer Setup
router.post('/register', function(req, res){
    User.register(new User({
        username: req.body.username,
        nickname: req.body.nickname, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        country: req.body.country,
        state: req.body.state,
        nacimiento: req.body.nacimiento,
        profesion: req.body.profesion,
        telefono: req.body.telefono,
        redSocial1: req.body.redSocial1,
        redSocial2: req.body.redSocial2,
        cedula: req.body.cedula,
        ideologia: req.body.ideologia,
        otras: req.body.otras,
        }), 
        req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res, function(){
            var output = `
            <h3>Un nuevo miembro se ha inscrito en el MLV:</h3>
            <ul>
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
              subject: 'Nuevo Miembro', // Subject line
              html: output // html body
          };
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              passport.authenticate('local')(req,res, function(){
                var output2 = `
                <h3>Bienvenido al MLV</h3>
                <p> Estimado ${req.body.firstName}, </p>
                <p> Agradecemos tu interes por unirte a la red libertaria mas grande de Venezuela. </p>
                <p> Por cuestiones de seguridad, pronto seras contactado por un coordinador para verificar tu identidad. 
                La inscripcion no sera efectiva hasta realizada esta operacion. 
                Puedes verificar y actualizar tus datos entrando a tu perfil personal en el intranet.</p>
                <p> </p>
                <p> Atentamente,</p>
                <p> La coordinacion nacional.</p>
              `;
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
                  to: `${req.body.firstName}`, // list of receivers
                  subject: 'Bienvenido al MLV', // Subject line
                  html: output2 // html body
              };
              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  res.render('success');
              });
            })
          });
        })
    });
});

router.get('/success', function(req, res){
    res.render('success');
});

module.exports = router;