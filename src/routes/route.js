import { 
    addNewContact, 
    getContacts, 
    getContactWithID, 
    updateContact,
    deleteContact,
    Contacts
} from '../controllers/controller';
// import express from "express";
// const router = express.Router();
import ContactSchema from '../models/model';

const routes = (app) => {
    // app.get('/members', (req, res) => {
        // let members = [
        //     {
        //         id : "1",
        //         firstName : "Jorge",
        //         lastName : "Perez"
        //     },
        //     {
        //         id : "2",
        //         firstName : "Cat",
        //         lastName : "Nunez"
        //     }
        // ]; 
        // res.render('members',{ContactSchema}
    //     res.json(contact)
    // });
    
    // app.get((req, res, next) => {
    //     // middleware
    //     console.log(`Request from: ${req.originalUrl}`)
    //     console.log(`Request type: ${req.method}`)
    //     next();
    // }, getContacts)

    app.route('/contact')
    .get((req, res, next) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`)
        console.log(`Request type: ${req.method}`)
        next();
    }, getContacts)

    // POST endpoint
    app.route('/members').get(getContacts);
    app.get('/register', (req, res) => res.render('register'));
    app.route('/register').post(addNewContact);
    // app.route('/members2').get(getContacts);
    app.get('/members2', (req, res) => res.render('members'));
    // const Contact = mongoose.model('Contact', ContactSchema);
    // import Contact from 
    // app.get('/members', (req, res) => {
    //     var cursor = Contacts.find();
    //     console.log("reading..");
    //     console.log(cursor)
    // })

    app.route('/members/:memberid')
    // get specific contact
    .get(getContactWithID)
    
    // put request
    .put(updateContact)

    // delete request
    .delete(deleteContact);
}

export default routes;
