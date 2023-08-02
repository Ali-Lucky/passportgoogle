const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const passportConfig = require('./passport/passport');
const passport = require('passport');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb+srv://Lucky:ejIoY6iVVc1sRKbS@cluster0.byhslvl.mongodb.net/passport', {
    useNewUrlParser: true
})
    .then(() => console.log(`DB Connected`))
    .catch(error => console.log(error));

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3 * 24 * 60 * 60 * 1000,
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use('/auth', auth);

const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login')
    } ;
    next();
};

app.get('/', isLoggedIn, (req, res) => {
    res.render('home');
});

app.listen(4000, () => {
    console.log(`Server is running at PORT 4000`);
});
