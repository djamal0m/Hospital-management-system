var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PatientSchema = new Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId, ref: "Doctor"
    },
    first_name: String,
    last_name: String,
    patient_id: String,
    address: String,
    phone: Number,
    relative_no: Number,
    gender: String,
    status: String,
    dob: String,
}, {
    timestamps:true,
});

module.exports = mongoose.model('User', PatientSchema);
