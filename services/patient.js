'use strict';

var Patient = require('../models/patient');

exports.create = function ( doctor, first_name, last_name, patient_id, address, phone, relative_no, gender,
  status, dob, callback) {
var patient = new Patient({
  doctor,
  first_name,
  last_name,
  patient_id,
  address,
  phone,
  relative_no,
  gender,
  status,
  dob,
});

  patient.save(callback);
};

exports.findById = function (id, callback) {
  Patient.findById(id)
    .populate('doctor')
    .exec(callback);
};

exports.find = function (params, callback) {
  Patient.find(params)
    .populate('doctor')
    .exec(callback);
};

exports.findOne = function (attributes, callback) {
  Patient.findOne(attributes)
    .populate('doctor')
    .exec(callback);
};

exports.update = function (patientId, params, callback) {
  Patient.findById(patientId, function (err, patient) {
    if (err) {
      return callback(err, null);
    }

    for (var prop in params) {
      patient[prop] = params[prop];
    }

    patient.save(callback);
  });
};

exports.count = function (params, callback) {
  Patient.count(params, callback);
};

exports.remove = function (patientId, callback) {
  Patient.remove({ _id: patientId }, function (err) {
    if (err) {
      return callback(err, null);
    }
    callback();
  });
};