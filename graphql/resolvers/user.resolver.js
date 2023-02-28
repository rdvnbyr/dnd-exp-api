const User = require('../../models/user');
const createError = require('http-errors');
const jwtService = require('../../services/jwt');
const bcryptService = require('../../services/bcrypt');
const validator = require('validator');

module.exports = {
  createUser: async (args, req) => {
    const errors = [];
    const { email, password, username } = args.userInput;
    if (!validator.isEmail(email)) {
      errors.push('Email is not valid');
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push('Password is not valid');
    }
    if (validator.isEmpty(username) || !validator.isLength(username, { min: 3 })) {
      errors.push('Username is not valid');
    }
    if (errors.length > 0) {
      const error = createError(400, 'Invalid input data');
      error.data = errors;
      throw error;
    }
    const hashedPassword = await bcryptService.hash(password);
    const checkUniqeEmail = await User.findOne({ email: email });
    if (checkUniqeEmail) {
      throw createError(400, 'Email already exists');
    }
    const user = new User({
      email: email,
      password: hashedPassword,
      username: username,
      role: 'user',
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createError(404, 'User not found');
    }
    const isMatch = await bcryptService.compare(password, user.password);
    if (!isMatch) {
      throw createError(400, 'Invalid credentials password or email is wrong.');
    }
    const token = await jwtService.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    return {
      token: token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        _id: user._id.toString(),
      },
    };
  },
  logout: async (_args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Unauthorized access.');
    }
    const findUser = await User.findById(req.currentUser.id);
    if (!findUser) {
      throw createError(404, 'User not found');
    }
    return {
      message: 'Logout successfully',
    };
  },
  getUser: async (_args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Unauthorized access.');
    }
    const user = await User.findById(req.currentUser.id);
    if (!user) {
      throw createError(404, 'User not found');
    }
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
    };
  },
  updateUser: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Unauthorized access.');
    }
    const { password, username } = args.userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push('Email is not valid');
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push('Password is not valid');
    }
    if (validator.isEmpty(username) || !validator.isLength(username, { min: 3 })) {
      errors.push('Username is not valid');
    }
    if (errors.length > 0) {
      const error = createError(400, 'Invalid input data');
      error.data = errors;
      throw error;
    }
    const user = await User.findById(req.currentUser.id);
    if (!user) {
      throw createError(404, 'User not found');
    }
    if (password) {
      const hashedPassword = await bcryptService.hash(password);
      user.password = hashedPassword;
    }
    if (username) {
      user.username = username;
    }
    await user.save();
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
    };
  },
  deleteUser: async (_args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Unauthorized access.');
    }
    const findUser = await User.findById(req.currentUser.id);
    if (!findUser) {
      throw createError(404, 'User not found');
    }
    await findUser.remove();
    return {
      message: 'User deleted successfully',
    };
  },
  ping: async () => {
    return {
      message: 'Testing graphql resolver!',
    };
  },
};
