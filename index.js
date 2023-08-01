const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const passportConfig = require('./passport/passport');
const passport = require('passport');
const cookieSession = require('cookie-session');

const app = express();

mongoose.connect('mongodb+srv://Lucky:ejIoY6iVVc1sRKbS@cluster0.byhslvl.mongodb.net/passport', {
    useNewUrlParser: true
})
    .then(() => console.log(`DB Connected`))
    .catch(error => console.log(error));

app.use(cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: ["mysecretkey"]
}));

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(4000, () => {
    console.log(`Server is running at PORT 4000`);
});