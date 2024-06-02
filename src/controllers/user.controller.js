const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const multerConfig = require('../config/multer.config');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const updateUserLocation = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { longitude, latitude } = req.body;
  const user = await userService.updateUserLocationById(userId, longitude, latitude);
  res.send(user);
});

const uploadImage = catchAsync(async (req, res) => {
  multerConfig.uploadImage(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    const fullUrl = req.protocol + '://' + req.get('host');

    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const imagePath = fullUrl + '/uploads/' + req.file.filename;

    user.profileImage = imagePath;
    user.save();
    const file = req.file;
    res.status(httpStatus.OK).json({ message: 'File saved successfully', profileImage: imagePath });
  });
});

const uploadAudio = catchAsync(async (req, res) => {
  multerConfig.uploadAudio(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    const fullUrl = req.protocol + '://' + req.get('host');

    const audioPath = fullUrl + '/uploads/audio/' + req.file.filename;

    res.status(httpStatus.OK).json({ message: 'File saved successfully', audioFile: audioPath });
  });
});

const getAudioFile = catchAsync(async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '/uploads/audio/', filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found.');
  }
});
const uploadExternalImageResource = catchAsync(async (req, res) => {
  multerConfig.uploadImage(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    const fullUrl = req.protocol + '://' + req.get('host');
    const resourcePath = fullUrl + '/uploads/' + req.file.filename;

    const file = req.file;
    res.status(httpStatus.OK).json({ message: 'File saved successfully', resourceUrl: resourcePath, file: file });
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserLocation,
  uploadImage,
  uploadExternalImageResource,
  uploadAudio,
  getAudioFile
};
