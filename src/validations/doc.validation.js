const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDoc = {
  body: Joi.object().keys({
    title: Joi.string().required(),
  }),
  files: Joi.array().required(),
};

const askDoc = {
  body: Joi.object().keys({
    collection_name: Joi.string().optional(),
    question: Joi.string().optional(),
  }),
};

const infoDoc = {
  body: Joi.object().keys({
    collection_id: Joi.string().required(),
  }),
};

module.exports = {
  createDoc,
  askDoc,
  infoDoc,
};
