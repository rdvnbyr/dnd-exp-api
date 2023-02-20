const createError = require('http-errors');
const jwtService = require('../services/jwt');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw createError(401, 'Authentication failed');
    const decodedToken = await jwtService.verify(token);
    req.user_credentials = decodedToken;
    next();
  } catch (err) {
    next(createError(401, 'Authentication failed'));
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user_credentials.role !== 'admin') {
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
          userId: req.user_credentials.id,
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

module.exports = {
  protect,
  isAdmin,
  isMember,
};
