const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../middleware/encrypt');
const db = require('../db/index');

//[TBD]
//log out the other user after registration (set cookie maxlife to 0)
//think of other use cases..

router.post('/register', async (req, res) => {
    console.log(req.body);
    const username = req.body.username.toString();
    const hashedPassword = await hashPassword(req.body.password);         //some description on how encryption works
    const foundUser = await db.queryTable('SELECT * FROM registered_users WHERE username = $1', [username])
    const firstFound = foundUser.rows[0];
    if (!firstFound) {
        await db.queryTable('INSERT INTO registered_users (user_id, username, password) VALUES (DEFAULT, $1, $2)', [username, hashedPassword]); 
        return res.json({ message: 'user registered', code: 200 })
    } else {
        return res.json({ message: 'user already exists', code: 400 })
    }
})

module.exports = router;
