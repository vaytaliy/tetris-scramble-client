const express = require("express");
const router = express.Router();

router.get("/greeting", async (req, res) => {

    // Request requires authorization.
    // Returns the username provided during registration.
    res.send({
        message: `Hello ${req.user.username}!`
    });
});

module.exports = router;
