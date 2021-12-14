const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    serviceid: {type: Schema.Types.String, ref:'services',required: [true,'ServiceId is required']},
    user: {type: Schema.Types.String, ref:'user'},
    rsvp:{type:String,required:[true,'Action is required']}
});
module.exports = mongoose.model('rsvp', rsvpSchema);