const mongoose = require('mongoose')
const Schema = require('mongoose').Schema

let purchaseSchema = new Schema({
    product : { type: Schema.Types.ObjectId, ref:'Product'},
    quantity : {type : Number , default : 1},
    size:{ type : String },
    pickup : { type: Schema.Types.ObjectId, ref:'Vendor' , default: null },
    customer :  { type: Schema.Types.ObjectId, ref:'Customer'},
    package_id : { type: String, default: null},
    delivered : { type : Boolean ,default:false}
      
},
{
    timestamps : true
})

var Purchases = mongoose.model('Purchase', purchaseSchema);
module.exports = {Purchases, purchaseSchema};