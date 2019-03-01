import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/route';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mlvdb', {
    useMongoClient: true
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

// serving static files
// app.use(express.static('public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
//     let members = [
//         {
//             id : "1",
//             firstName : "Jorge",
//             lastName : "Perez"
//         },
//         {
//             id : "2",
//             firstName : "Cat",
//             lastName : "Nunez"
//         }
//     ]
// });

// app.get('/', (req, res) => { 
    res.render('index')
});

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);