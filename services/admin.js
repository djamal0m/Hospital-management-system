'use strict';

var Admin = require('../models/admin');
var crypto = require ('crypto');


exports.register = function (email, password, role, callback) {
  var shaSum = crypto.createHash('sha256');

  shaSum.update(password);

  var admin = new Admin({
    email,
    role,
    password: shaSum.digest('hex')
  });

  admin.save(callback);
};

exports.findById = function (id, callback) {
  Admin.findById(id)
    .populate('zone')
    .exec(callback);
};

exports.find = function (params, callback) {
  Admin.find(params)
    .populate('zone')
    .exec(callback);
};

exports.findOne = function (attributes, callback) {
  Admin.findOne(attributes)
    .populate('zone')
    .exec(callback);
};

exports.findByEmailAndPassword = function (email, password, callback) {
  var shaSum = crypto.createHash('sha256');

  shaSum.update(password);

  Admin.findOne({email, password: shaSum.digest('hex')})
    .exec(callback);
};

exports.update = function (adminId, params, callback) {
  Admin.findById(adminId, function (err, admin) {
    if (err) {
      return callback(err, null);
    }

    for (var prop in params) {
      admin[prop] = params[prop];
    }

    admin.save(callback);
  });
};

exports.updatePassword = function (adminId, password, callback) {
  Admin.findById(adminId, function (err, admin) {
    if (err) {
      return callback(err, null);
    }

    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    admin.password = shaSum.digest('hex');

    admin.save(callback);
  });
};

exports.remove = function (adminId, callback) {
  Admin.remove({ _id: adminId }, function (err) {
    if (err) {
      return callback(err, null);
    }
    callback();
  });
};

