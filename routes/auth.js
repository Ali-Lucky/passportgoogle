const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}), (req, res) => {
    console.log("google");
    res.send('login with Google');
});

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.send(req.user);
});

module.exports = router;