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


//This file doesnt do jack yet..

module.exports = {
    UserFindById: User.findById(req.user._id, (err, User) => {
    if (err) {
        res.send(err)};
    })
}

export const UserFindById = (req, res) => {
    User.findById(req.user._id, (err, User) => {
        if (err) {
            res.send(err)};
        })
    }

export const getContactWithID = (req, res) => {
    Contact.findById(req.params.contactId, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    });
}