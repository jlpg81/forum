import mongoose from 'mongoose';
import { ContactSchema } from '../models/model';

const Contact = mongoose.model('Contact', ContactSchema);

export const addNewContact = (req, res) => {
    let newContact = new Contact(req.body);
    newContact.save((err, contact) => {
        if (err) {
            res.send(err);
        }
        res.render('Success')
    });
};

export const getContacts = (req, res) => {
    Contact.find({}, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.render('members', {contact});
    });
};

export const getContactWithID = (req, res) => {
    Contact.findById(req.params.id, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.render('account', {contact});
    });
}

// export const getContactWithId = (req, res, id) => {
//     Contact.findById(id, (err, contact) => {
//         if (err) {
//             res.send(err);
//         }
//         res.send('account', {contact});
//     });
// };

// export const getContactWithID = (req, res) => {
//     Contact.findById(req.params.contactId, (err, contact) => {
//         if (err) {
//             res.send(err);
//         }
//         res.json(contact);
//     });
// }

export const updateContact = (req, res) => {
    Contact.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: false }, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.render('updated');
    })
}

export const deleteContact = (req, res) => {
    Contact.remove({ _id: req.params.contactId }, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted contact'});
    })
}