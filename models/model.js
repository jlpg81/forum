import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ContactSchema = new Schema({
    firstName: {
        type: String,
        required: 'Escriba su nombre'
    },
    lastName: {
        type: String,
        required: 'Escriba su apellido'
    },
    email: {
        type: String,
        required: 'Por favor escriba su Email'
    },
    created_date: {
       type: Date,
       default: Date.now 
    }
});
