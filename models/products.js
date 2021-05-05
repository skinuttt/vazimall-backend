const mongoose = require('mongoose')
const Schema = require('mongoose').Schema

let productSchema = new Schema({
    vendor : { type: Schema.Types.ObjectId, ref:'Vendor'},
    photos : [{ type : String }],
    name : { type : String },
    gender : { type : String },
    category : { type : String },    
    price : { type : Number },
    description : { type : String },
    sizes:[{
        size: {type:String},
        quantity : {type:Number}
    }],
    liked_by : [{ type : Schema.Types.ObjectId ,ref : 'Customer' }],
    keywords : [{ type : String}],
},
{
    timestamps : true
})

var Products = mongoose.model('Product', productSchema);
module.exports = {Products, productSchema};