import { 
    addNewContact, 
    getContacts, 
    getContactWithID, 
    updateContact,
    deleteContact
} from '../controllers/controller';


const routes = (app) => {

    app.route('/contact').get((req, res, next) => {getContacts});
    app.route('/members').get(getContacts);
    app.get('/register', (req, res) => res.render('register'));
    app.route('/register').post(addNewContact);    
    app.get('/forum', (req, res) => res.render('forum'));
    app.get('/dashboard', (req, res) => res.render('dashboard'));
    app.get('/chat', (req, res) => res.render('chat'));

    // get specific contact
    app.route('/members/:id').get(getContactWithID);
    
    // put request
    app.route('/members/:id').post(updateContact);
    // app.route('/members/:id').put(updateContact);

    // delete request
    // En vez de borrar usuarios se les reducira el nivel a 0 y se eliminaran de las listas de miembros, sin embargo
    // seguiran estando activos en la base de datos hasta que se proceda a su eliminacion manual, despues de un tiempo
    // minimo (3 meses, 1 ano, etc.)
    // app.route('/members/:id').delete(deleteContact);

    // 404
    // app.get('*', function(req, res){
    //     res.status(404).send('Were sorry, this page does not exist.');
    // });    
}

export default routes;
