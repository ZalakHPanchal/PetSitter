const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    Name: {type: String, required: [true, 'Name is required']},
    OwnerName: {type: String, required: [true, 'Owner Name is required']},
    Breed: {type: String, required: [true, 'Breed is required']},
    Service: {type: String, required: [true, 'Service is required']},
    Description: {type: String, required: [true, 'content is required'], 
              minLength: [10, 'Description of service should have at least 10 characters']},
    logo: {type: String, required: [true, 'Link for Logo is required']},
    Date_implemented: {type: String, required: [true, 'Service Date is required']},
    start_time: {type: String, required: [true, 'Start Time is required']},
    end_time: {type: String, required: [true, 'End Time is required']},
    author: {type: Schema.Types.ObjectId, ref:'user'},
    rsvpcount:{type:Number}
},
{timestamps: true}
);
module.exports = mongoose.model('service', ServiceSchema);


