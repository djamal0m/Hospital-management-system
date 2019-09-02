'use strict';

var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  firstname: {type: String},
  lastname: {type: String},
  phonenumber: {type: String},
  password: {type: String},
  role: { type: String, enum: ['coordonateur', 'superadmin'], default: 'superadmin'},
}, {
  timestamps: true,
});

module.exports = mongoose.model('Admin', AdminSchema);
