const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDoc = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
  }),
  file: Joi.any().required(),
};

const askDoc = {
  body: Joi.object().keys({
    collection_name: Joi.string().optional(),
    question: Joi.string().optional(),
    mode: Joi.string().optional(),
    initial_prompt: Joi.string().optional(),
  }),
};

module.exports = {
  createDoc,
  askDoc,
};
