var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DoctorSchema = new Schema({
    first_name: String,
    last_name: String,
    doctor_id: String,
    address: String,
    phone: Number,
    specialty: String,
}, {
    timestamps:true,
});


module.exports = mongoose.model('Doctor', DoctorSchema);
