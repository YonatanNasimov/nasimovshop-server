const mongoose = require('mongoose');
const Joi = require("joi");


const productSchema = new mongoose.Schema({
    title: String,
    desc:  String, 
    img_url: String,
    categories: Array ,
    user_id: String,
    size: Array ,
    color:  Array ,
    price: Number,
    inStock:{type:Boolean ,default:true},
},
    {
        timestamps: true
    });

exports.ProductModel = mongoose.model("products", productSchema)

exports.validProduct = (_reqBody) => {
    let joiSchema = Joi.object({
        title: Joi.string().min(3).max(99).required(),
        desc: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(3).max(999).required(),
        categories: Joi.array().min(1).max(9999).required(),
        size: Joi.array().min(1).max(10).required(),
        color: Joi.array().min(1).max(99).required(),
        price: Joi.number().min(1).max(99999).required(),
    })

    return joiSchema.validate(_reqBody);
}
