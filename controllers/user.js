const User = require('../models/user');
const createError = require('http-errors');
const jwtService = require('../services/jwt');
const bcryptService = require('../services/bcrypt');

const createUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
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
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const findUser = await User.findById(req.currentUser.id);
    if (!findUser) {
      throw createError(404, 'User not found');
    }
    res.status(200).json({ message: 'Logout' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUser.id);
    if (!user) {
      throw createError(404, 'User not found');
    }
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { password, username, email } = req.body;
    const findUser = await User.findById(req.currentUser.id);
    if (!findUser) {
      throw createError(404, 'User not found');
    }
    if (password) {
      const hashedPassword = await bcryptService.hash(password);
      findUser.password = hashedPassword;
    }
    if (username) {
      findUser.username = username;
    }
    if (email) {
      findUser.email = email;
    }

    await findUser.save();
    res.status(200).json({
      message: 'User updated successfully.',
      user: {
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const findUser = await User.findById(req.currentUser.id);
    if (!findUser) {
      throw createError(404, 'User not found');
    }
    await findUser.remove();
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  logout,
  getMe,
  updateUser,
  deleteUser,
};
