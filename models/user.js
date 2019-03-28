const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    nickname: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    nacimiento: {
        type: String,
    },
    profesion: {
        type: String,
    },
    telefono: {
        type: String,
    },
    redSocial1: {
        type: String,
    },
    redSocial2: {
        type: String,
    },
    cedula: {
        type: String,
    },
    ideologia: {
        type: String,
    },
    otras: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now 
    },
    level: {
        type: Number,
        default: 0
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Users", UserSchema);
