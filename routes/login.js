const express = require('express');
const router = express.Router();
const passport = require('passport');


router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.redirect('/');
})

module.exports = router;