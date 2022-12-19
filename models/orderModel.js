const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: String},
    username: { type: String},
    products: [
        {
            productId:{
                type:String,
            },
            quantity:{
                type:Number,
                default:1
            },
        },
    ],
    amount:{type: Number, required:true},
    adress:{type:Object ,required:true },
    status:{type:String ,default:"pending" },
},
    {
        timestamps: true
    });

exports.OrderModel = mongoose.model("orders", OrderSchema)