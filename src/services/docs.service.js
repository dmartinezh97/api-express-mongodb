const httpStatus = require('http-status');
const { Docs } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Crea un documento
 * @param {Object} docBody
 * @returns {Promise<User>}
 */
const createDoc = async (docBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'El correo electrónico ya está registrado');
  }
  return User.create(userBody);
};

module.exports = {
  createDoc,
};
