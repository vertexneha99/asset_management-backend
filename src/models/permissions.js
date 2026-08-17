const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
  code: { type: String, required: true, trim: true, unique: true },
  module: { type: String, required: true, trim: true },
  action: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
});

module.exports = mongoose.model('Permission', permissionSchema, 'permissions');
