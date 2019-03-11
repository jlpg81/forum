import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import routes from './routes/route';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mlvdb', {
    useMongoClient: true
});

// bodyparser setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

//initializing app
routes(app);

// Ejs setup
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

// Listening on a port
app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);