const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { docsTypes } = require('../config/docs');
const { convertirTituloASlug } = require('../utils/stringUtils');

const docSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      private: true,
    },
    type: {
      type: String,
      enum: [docsTypes.PDF],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    collection_name: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
docSchema.plugin(toJSON);
// docSchema.plugin(paginate);

// /**
//  * Check if email is taken
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
//  * @returns {Promise<boolean>}
//  */
// docSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//   const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//   return !!user;
// };

// /**
//  * Check if password matches the user's password
//  * @param {string} password
//  * @returns {Promise<boolean>}
//  */
// docSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

docSchema.pre('save', async function (next) {
  const doc = this;
  doc.collection_name = convertirTituloASlug(doc.title)
  
  next();
});

/**
 * @typedef Docs
 */
const Docs = mongoose.model('Doc', docSchema);

module.exports = Docs;
