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

var PORT = 3002;

//Mongoose Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/forum3", { useNewUrlParser: true });

//Express setup
const app = express();
app.set('view engine','ejs');

//Passport setup
app.use(require('express-session')({
    secret:"42",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Other setup
app.use(methodOverride("_method"));
app.use(express.static("public"));

//Routes
app.use(mainRoutes);
app.use(registryRoutes);
app.use(forumRoutes);
app.use(adminRoutes);

// code to check passwords is in: http://jsfiddle.net/aelor/F6sEv/324/

//Server setup
app.listen(PORT, () =>
    console.log(`Server initialized on port: ${PORT}`)
);