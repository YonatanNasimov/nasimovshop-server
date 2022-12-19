const router = require("express").Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { CartModel } = require("../models/cartModel")

// get all carts
router.get("/", authAdmin, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await CartModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

// get user cart
router.get("/:userId", auth, async (req, res) => {
    try {
        let userId = req.params.userId;
        let data = await CartModel.findOne({ _id: userId })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

// create cart
router.post("/", auth, async (req, res) => {
    try {
        let cart = new CartModel(req.body);
        await cart.save();
        res.status(200).json(cart);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// update cart
router.put("/:idEdit", auth, async (req, res) => {
    try {
        let idEdit = req.params.idEdit
        let data;
        if (req.tokenData.role == "admin") {
            data = await CartModel.updateOne({ _id: idEdit }, req.body);
        }
        else {
            data = await CartModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// delete cart
router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel
        let data;
        if (req.tokenData.role == "admin") {
            data = await CartModel.deleteOne({ _id: idDel });
        }
        else {
            data = await CartModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router