const router = require("express").Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { ProductModel, validProduct } = require("../models/productModel")

// get products
router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  let qNew = req.query.new;
  let qCategory = req.query.category
  let searchReg = new RegExp(qCategory, "i");
  try {
    let data;
    if (qNew) {
      data = await ProductModel.find().sort({ createdAt: -1 }).limit(1).lean()
    } else if (qCategory) {
      data = await ProductModel.find({ $or: [{ title: searchReg }, { desc: searchReg }, { categories: searchReg }] }).limit(perPage).skip((page - 1) * perPage)
    } else {
      data = await ProductModel
        .find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
    }
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

// get one products
router.get("/:idProd", async (req, res) => {
  try {
    let data;
    let idProd = req.params.idProd;
    if (idProd) {
      data = await ProductModel.find({ _id: idProd })
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

router.get("/find/search", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = req.query.page || 1;
  try {
    let searchQ = req.query.s;
    let searchReg = new RegExp(searchQ, "i");
    let data = await ProductModel.find({ $or: [{ title: searchReg }, { desc: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
})

// post products
router.post("/", auth, async (req, res) => {
  let validBody = validProduct(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details)
  }
  try {
    let product = new ProductModel(req.body);
    product.user_id = req.tokenData._id;
    await product.save();
    res.json(product);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// update product 
router.put("/:idEdit", auth, async (req, res) => {

  let validBody = validProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    let idEdit = req.params.idEdit
    let data;
    if (req.tokenData.role == "admin") {
      data = await ProductModel.updateOne({ _id: idEdit }, req.body);
    }
    else {
      data = await ProductModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);
    }
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// delete product
router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel
    let data;
    if (req.tokenData.role == "admin") {
      data = await ProductModel.deleteOne({ _id: idDel });
    }
    else {
      data = await ProductModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
    }
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router