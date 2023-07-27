const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { docsService } = require('../services');
const { getUserPath } = require('../utils/generatePath');
const { limpiarEspacios, randomString } = require('../utils/stringUtils');

const createDoc = catchAsync(async (req, res) => {
  const { title } = req.body
  const { id: user_id } = req.user

  const newDoc = await docsService.createDocPDF(user_id, title)
  res.status(httpStatus.CREATED).send(newDoc);
});

const askDoc = catchAsync(async (req, res) => {
  const { collection_name, question } = req.body;
  const { id } = req.user
  const mode = 'pair_programming'
  const initial_prompt = ''

  const result = await docsService.askPDF(id, collection_name, question, mode, initial_prompt)
  res.status(httpStatus.CREATED).send(result);
});

const getDocs = catchAsync(async (req, res) => {
  const { id } = req.user

  const result = await docsService.getDocsByUserId(id);
  res.send(result);
});

const getInfo = catchAsync(async (req, res) => {
  const { collection_id } = req.body;
  const { id } = req.user

  const result = await docsService.getListDocsByUserId(id, collection_id);

  // res.download(result);
  res.send(result);
});

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });

// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  createDoc,
  askDoc,
  getDocs,
  getInfo,
  // getUsers,
  // getUser,
  // updateUser,
  // deleteUser,
};
