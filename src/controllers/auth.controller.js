const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const forgotPasswordWithCode = catchAsync(async (req, res) => {
  const resetPasswordCode =  tokenService.generateRandomCode();
  const user = await userService.getUserByEmail(req.body.email)
  if(!user){
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  user.OTPcode = resetPasswordCode;
  user.save();
  await emailService.sendResetPasswordEmailCode(req.body.email, resetPasswordCode);
  res.status(httpStatus.CREATED).send({message: 'Reset Password code sent successfully.'});
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPasswordWithCode = catchAsync(async (req, res) => {
  const {password, code, email} = req.body
  await authService.resetPasswordWithCode(code, password, email);
  res.status(httpStatus.OK).send({message: 'Password reset successfully.'});
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmailCode = catchAsync(async (req, res) => {

  const verifyEmailCode = tokenService.generateRandomCode();

  const userId = req.user.id;

  const user = await userService.getUserById(userId);
  if(!user){
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  if(user.isOTPVerified){
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Already Verified');
  }
  emailService.sendOTPVerificationEmail(user.email, verifyEmailCode);
  user.OTPcode = verifyEmailCode;
  user.save();

  res.status(httpStatus.CREATED).send({message: "Verification code sent successfully to email."})
});

const verifyEmailCode = catchAsync(async (req, res) => {

  const { code } = req.body;
  const userId = req.user.id;

  const user = await userService.getUserById(userId);
  if(!user){
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  if(user.isOTPVerified){
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Already Verified');
  }
  if(user.OTPcode === code){
    user.isOTPVerified = true;
    user.OTPcode = null
    user.save();
    return res.status(httpStatus.CREATED).send({message: "Email verified successfully."})
  }else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Verification Code');
  }
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendVerificationEmailCode,
  verifyEmailCode,
  forgotPasswordWithCode,
  resetPasswordWithCode
};
