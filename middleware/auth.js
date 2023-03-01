const createError = require('http-errors');
const jwtService = require('../services/jwt');

const protect = async (req, res, next) => {
  try {
    let token = null;
    const { authorization } = req.headers;
    if (
      authorization &&
      authorization.startsWith('Bearer') &&
      authorization.split(' ').length === 2
    ) {
      token = authorization.split(' ')[1];
    } else {
      token = req.query['access_token'];
    }
    if (!token && typeof token != 'string')
      throw createError(401, 'Authentication failed');
    const decodedToken = await jwtService.verify(token);
    req.currentUser = decodedToken;
    next();
  } catch (err) {
    next(createError(401, 'Authentication failed'));
  }
};

const protectGraphql = async (req, res, next) => {
  try {
    let token = null;
    const { authorization } = req.headers;
    if (
      authorization &&
      authorization.startsWith('Bearer') &&
      authorization.split(' ').length === 2
    ) {
      token = authorization.split(' ')[1];
    } else {
      token = req.query['access_token'];
    }
    if (!token && typeof token != 'string') {
      req.isAuth = false;
      return next();
    }
    const decodedToken = await jwtService.verify(token);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.currentUser = decodedToken;
    req.isAuth = true;
    next();
  } catch (err) {
    req.isAuth = false;
    next();
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.currentUser.role !== 'admin') {
      throw createError(401, 'Not authorized');
    }
    next();
  } catch (err) {
    next(err);
  }
};

const isMember = async (req, res, next) => {
  try {
    const findUser = await Workspace.findOne({
      _id: req.params.workspaceId,
      users: {
        $elemMatch: {
          userId: req.currentUser.id,
        },
      },
    });
    if (!findUser) {
      throw createError(401, 'Not authorized to access this workspace resource.');
    }
    next();
  } catch (err) {
    next(err);
  }
};

const isOwner = async (req, res, next) => {
  try {
    const findUser = await Workspace.findOne({
      _id: req.params.workspaceId,
      owner: req.currentUser.id,
    });
    if (!findUser) {
      throw createError(402, 'You are not the owner of this workspace resource.');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  protect,
  protectGraphql,
  isAdmin,
  isMember,
  isOwner,
};
