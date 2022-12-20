const router = require("express").Router();
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel")
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
    res.json({ msg: "auth work..." })
});

// sign up 
router.post("/signup", async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "***";
        res.status(201).json(user);
    } catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email or username already in system, try log in", code: 11000 })
        }
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})

// login
router.post("/login", async(req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({ username: req.body.username })
        if (!user) {
            return res.status(401).json({ msg: "Password or username is worng ,code:1" })
        }
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or username is worng ,code:2" });
        }
        let token = createToken(user._id, user.role);
        res.status(200).json({ token, user ,userName: user.name });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


module.exports = router;