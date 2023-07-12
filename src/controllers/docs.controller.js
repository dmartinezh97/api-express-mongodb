const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { docsService } = require('../services');

const createDoc = catchAsync(async (req, res) => {
  const { name } = req.body
  const { id } = req.user
  const path = `./uploads/${id}`

  const newDoc = await docsService.createDocPDF(name, path)
  res.status(httpStatus.CREATED).send(newDoc);
});

const askDoc = catchAsync(async (req, res) => {
  const result = await docsService.askPDF(req)
  res.status(httpStatus.CREATED).send(result);
});

// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

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
  // getUsers,
  // getUser,
  // updateUser,
  // deleteUser,
};
