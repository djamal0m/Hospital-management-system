'use strict';

var Doctor = require('../models/doctor');

exports.create = function ( first_name, last_name, doctor_id, address, phone, specialty, callback) {
var doctor = new Doctor({
  first_name,
  last_name,
  doctor_id,
  address,
  phone,
  specialty,
});

  doctor.save(callback);
};

exports.findById = function (id, callback) {
  Doctor.findById(id)
    .exec(callback);
};

exports.find = function (params, callback) {
  Doctor.find(params)
    .exec(callback);
};

exports.findOne = function (attributes, callback) {
  Doctor.findOne(attributes)
    .exec(callback);
};

exports.update = function (doctorId, params, callback) {
  Doctor.findById(doctorId, function (err, doctor) {
    if (err) {
      return callback(err, null);
    }

    for (var prop in params) {
      doctor[prop] = params[prop];
    }

    doctor.save(callback);
  });
};

exports.count = function (params, callback) {
  Doctor.count(params, callback);
};

exports.remove = function (doctorId, callback) {
  Doctor.remove({ _id: doctorId }, function (err) {
    if (err) {
      return callback(err, null);
    }
    callback();
  });
};