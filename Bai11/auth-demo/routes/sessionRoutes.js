const express = require('express');
const router = express.Router();

router.get('/set', (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    req.session.userData = { name: "Alice", role: "user" };
    req.session.message = "Hello Session !";

    res.json({ message: `Session data set. Views: ${req.session.views}`});
});

router.get('/get', (req, res) => {
    if(req.session.views) {
        console.log(req.session);
        res.json({ message: "Get Session" });
    } else {
        res.json({ message: "No session data. Try /set first."})
    }
});

router.get('/update', (req, res) => {
    if(req.session.userData) {
        req.session.userData.lastSeen = new Date();
        res.json({ message: "Session data update !"})
    } else {
        res.json({ message: "No session data. Try /set first."})
    }
})

router.get('/destroy', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Could not destroy session.");
            }
            res.json({ message: "Session detroyed successfully !" });
        })
    } else {
        res.json({ message: "No active session to destroy" });
    }
})

module.exports = router;