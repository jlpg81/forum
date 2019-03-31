const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        methodOverride          = require('method-override');

// useless file atm

// module.exports = {
// emailToMLV: passport.authenticate('local')(req,res, function(){
//     const output = `
//     <h3>Un nuevo miembro se ha inscrito en el MLV:</h3>
//     <ul>
//       <li>Name: ${req.body.username}</li>
//       <li>Company: ${req.body.nickname}</li>
//       <li>Email: ${req.body.firstName}</li>
//       <li>Phone: ${req.body.lastName}</li>
//       <li>username: ${req.body.username}</li>
//       <li>nickname: ${req.body.nickname}</li> 
//       <li>firstName: ${req.body.firstName}</li>
//       <li>lastName: ${req.body.lastName}</li>
//       <li>country: ${req.body.country}</li>
//       <li>state: ${req.body.state}</li>
//       <li>nacimiento: ${req.body.nacimiento}</li>
//       <li>profesion: ${req.body.profesion}</li>
//       <li>telefono: ${req.body.telefono}</li>
//       <li>redSocial1: ${req.body.redSocial1}</li>
//       <li>redSocial2: ${req.body.redSocial2}</li>
//       <li>cedula: ${req.body.cedula}</li>
//       <li>ideologia: ${req.body.ideologia}</li>
//       <li>otras: ${req.body.otras}</li>
//     </ul>
//   `;
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.ionos.es',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'it@mlv-intranet.org', // generated ethereal user
//         pass: 'supersecret'  // generated ethereal password
//     },
//     tls:{
//       rejectUnauthorized:false
//     }
//   });
//   // setup email data with unicode symbols
//   let mailOptions = {
//       from: '"MLV Intranet Admin" <it@mlv-intranet.org>', // sender address
//       to: 'jlpg81@gmail.com', // list of receivers
//       subject: 'Nuevo Miembro', // Subject line
//       html: output // html body
//   };
//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log('Message sent: %s', info.messageId);   
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//       res.render('success');
//   });
// })

// }