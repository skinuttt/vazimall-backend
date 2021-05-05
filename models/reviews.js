const mongoose = require('mongoose')
const Schema = require('mongoose').Schema

let reviewSchema = new Schema({
    product : { type: Schema.Types.ObjectId, ref:'Product'},
    message : { type: String },
    customer :  { type: Schema.Types.ObjectId, ref:'Customer'},      
},
{
    timestamps : true
})

var Reviews = mongoose.model('Review', reviewSchema);
module.exports = {Reviews, reviewSchema};