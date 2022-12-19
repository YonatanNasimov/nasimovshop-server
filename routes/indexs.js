const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({ msg: "express work..." })
});

module.exports = router;