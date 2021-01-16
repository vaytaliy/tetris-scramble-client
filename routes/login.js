const express = require('express');
const router = express.Router();
const passport = require('passport');


router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.json({data: {user: req.user.username}});
})

module.exports = router;
