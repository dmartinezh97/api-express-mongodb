const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDoc = {
  body: Joi.object().keys({
    title: Joi.string().required(),
  }),
  file: Joi.any().required(),
};

const askDoc = {
  body: Joi.object().keys({
    collection_name: Joi.string().optional(),
    question: Joi.string().optional(),
  }),
};

module.exports = {
  createDoc,
  askDoc,
};
