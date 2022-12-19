const router = require("express").Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { OrderModel } = require("../models/orderModel");


// get all orders
router.get("/", authAdmin, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await OrderModel
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

// get user orders
router.get("/:userId", auth, async (req, res) => {
    try {
        let userId = req.params.userId;
        let data = await OrderModel.find({ _id: userId })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

// get monthly orders
router.get("/get/income", authAdmin, async (req, res) => {
    const productId = req.query.pId;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        let data = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth }, ...(productId && {
                        products: { $elemMatch: { productId } },
                    }),
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// create order
router.post("/", auth, async (req, res) => {
    try {
        let order = new OrderModel(req.body);
        await order.save();
        res.status(200).json(order);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// update order only amin
router.put("/:idEdit", authAdmin, async (req, res) => {
    try {
        let idEdit = req.params.idEdit
        let data;
        if (req.tokenData.role == "admin") {
            data = await OrderModel.updateOne({ _id: idEdit }, req.body);
        }
        else {
            data = await OrderModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// delete order
router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel
        let data;
        if (req.tokenData.role == "admin") {
            data = await OrderModel.deleteOne({ _id: idDel });
        }
        else {
            data = await OrderModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router