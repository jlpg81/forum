const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        methodOverride          = require('method-override'),
        User                    = require('./models/user'),
        mainRoutes              = require('./routes/mainRoutes'),
        registryRoutes          = require('./routes/registryRoutes'),
        adminRoutes             = require('./routes/adminRoutes'),
        forumRoutes             = require('./routes/forumRoutes');

module.exports = {
    findById: findById(req.user._id, (err, User) => {
    if (err) {
        res.send(err)};
    })
}