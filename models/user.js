const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: 'Por favor escriba su Email'
    },
    password: {
        type: String,
        // required: 'Por favor escriba una clave'
    },
    firstName: {
        type: String,
        default: "nombre"
        // required: 'Escriba su nombre'
    },
    lastName: {
        type: String,
        default: "apellido"
        // required: 'Escriba su apellido'
    },
    country: {
        type: String,
        // required: 'Escriba su pais de residencia actual' 
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
