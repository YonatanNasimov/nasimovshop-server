const mongoose = require('mongoose');
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone:String,
    img_url: String,
    role: { type: String, default: "user" },
    active: { type: Boolean, default: true, },
},
    {
        timestamps: true
    });

exports.UserModel = mongoose.model("users", userSchema)

exports.createToken = (_id, role) => {
    let token = jwt.sign({ _id, role }, config.tokenSecret, { expiresIn: "30d" });
    return token;
}

exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
        username: Joi.string().min(3).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required(),
        img_url: Joi.string().min(2).max(9999).allow(null, ""),
        phone: Joi.string().min(2).max(99).required(),
    })

    return joiSchema.validate(_reqBody);
}

exports.validUserPut = (_reqBody) => {
    let joiSchema = Joi.object({
        username: Joi.string().min(3).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        img_url: Joi.string().min(2).max(9999).allow(null, ""),
        phone: Joi.string().min(2).max(99).required(),
    })

    return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        username: Joi.string().min(3).max(99).required(),
        password: Joi.string().min(3).max(99).required()
    })

    return joiSchema.validate(_reqBody);
}