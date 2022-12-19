const router = require("express").Router();
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, validUser, validUserPut } = require("../models/userModel")

router.get("/", (req, res) => {
    res.json({ msg: "users work..." })
});

//   get all users also new users (?new=true) only by admin
router.get("/usersList", authAdmin, async (req, res) => {
    let query = req.query.new
    try {
        let data = query
            ? await UserModel.find({}, { password: 0 }).sort({ _id: -1 }).limit(5).lean()
            : await UserModel.find({}, { password: 0 }).limit(20).lean()
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
});

//   get only one user by id only by admin
router.get("/:idUser", authAdmin, async (req, res) => {
    try {
        let idUser = req.params.idUser;
        let data = await UserModel.findOne({ _id: idUser }, { password: 0 })
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
});

//   get user from last year
router.get("/get/stats", authAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    try {
        let data = await UserModel.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
});

// get users info
router.get("/get/myInfo", auth, async(req, res) => {
    try {
        let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(userInfo);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// count users
router.get("/get/count", authAdmin, async(req, res) => {
    try {
        // מחזיר את מספר הרשומות מהקולקשן
        let count = await UserModel.countDocuments({})
        res.json({ count })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// update user without password
router.put("/:idEdit", auth, async (req, res) => {

    let validBody = validUserPut(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        if (req.body.password) {
            return res.status(500).json({ msg: "cant change password", code: 11000 })
        }
        let idEdit = req.params.idEdit
        let data;
        if (req.tokenData.role == "admin") {
            data = await UserModel.updateOne({ _id: idEdit }, req.body);
        }
        else {
            data = await UserModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// delete user
router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel
        let data;
        if (req.tokenData.role == "admin") {
            data = await UserModel.deleteOne({ _id: idDel });
        }
        else {
            data = await UserModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// change user to admin, only by admin 
router.patch("/changeRole/:userID", authAdmin, async(req, res) => {
    if (!req.body.role) {
        return res.status(400).json({ msg: "Need to send role in body" });
    }

    try {
        let userID = req.params.userID
            // cant change super admin
        if (userID == "637915e9d7ddb71f61a2f71d") {
            return res.status(401).json({ msg: "You cant change superadmin to user" });

        }
        let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// give ban to user only by admin
router.patch("/active/changeActive/:userID", authAdmin, async(req, res) => {
    if (!req.body.active && req.body.active != false) {
        return res.status(400).json({ msg: "Need to send active in body" });
    }
    try {
        let userID = req.params.userID
            // cant change superadmin 
        if (userID == "637915e9d7ddb71f61a2f71d") {
            return res.status(401).json({ msg: "You cant change superadmin to user" });
        }
        let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


module.exports = router