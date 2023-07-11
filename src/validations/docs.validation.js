const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDoc = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
  }),
  file: Joi.any().required(),
};

module.exports = {
  createDoc,
};
