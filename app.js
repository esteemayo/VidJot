const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');



// REQUIRING ROUTE
const ideaRoute = require('./routes/idea');
const userRoute = require('./routes/user');

// PASSPORT CONFIG
require('./config/passport')(passport);


const app = express();



// CONNECT TO MONGODB
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(`Could not connect to MongoDB: ${err}`));

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BODY-PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// METHOD-OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'));

// EXPRESS SESSION
app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// FLASH
app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
});




app.use('/ideas', ideaRoute);
app.use('/users', userRoute);




app.get('/', (req, res) => {
    let title = 'Welcome';
    res.render('index', { title });
});

app.get('/about', (req, res) => {
    res.render('about');
});


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));