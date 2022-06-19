const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/COMSDatabase", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("database connection successful"))
    .catch((err) => console.log(err));

const CANTEENSCHEMA = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'must have a name']
    },
    sid : {
        type : String,
        required : [true, 'requires unique custom store id']
    },
    phone : {
        type : Number,
        required : [true, 'requires phone number']
    },
    password : {
        type : String,
        required : [true, 'must have a name']
    },
    open : {
        type : Boolean,
        default : false
    }, 
    orderNumbers : [Number], //order numbers from order Schema
    description : String,
    drinks : [
        {
            name : {
                type : String,
                required : true,
                unique : true 
            }, 
            totalStocks : Number,
            usedStocks : Number,
            price : String
        }
    ],
    snacks : [
        {
            name : {
                type : String,
                required : true,
                unique : true
            },
            totalStocks : Number,
            usedStocks : Number,
            price : String
        }
    ]
})

const ORDERSCHEMA = mongoose.Schema ({
    // order id is document id
    orderNumber : {
        type : Number,
        required : [true, 'No Order Number Available'],
        // unique : true
    },
    canteen : {
        type : String,  //canteen name
        required : true
    },
    orderList : {
        type : [{
            name : String,
            price : String,
            quantity : Number 
        }],
        required : [true, 'must have order'],
    },
    orderDate : {
        type : Date,
        required : true
    },
    active : {
        type : Boolean,
        default : true
    }
})






const CANTEEN = mongoose.model('CANTEEN', CANTEENSCHEMA)
const ORDER = mongoose.model('ORDER', ORDERSCHEMA)

module.exports = [CANTEEN, ORDER]