const Workspace = require('../models/Workspace');
const Board = require('../models/board');
const createError = require('http-errors');
const _ = require('lodash');
const { validationResult } = require('express-validator');

const createWorkspace = async (req, res, next) => {
  try {
    const result = validationResult(req);
    // console.log(result);
    const workspace = new Workspace(req.body);
    await workspace.save();
    res.status(200).json({ message: 'Workspace created' });
  } catch (err) {
    next(err);
  }
};

const getWorkspaces = async (req, res, next) => {
  try {
    const where = { 'users.userId': req.user_credentials.id };
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user_credentials.id }, where],
    });
    res.status(200).json(workspaces);
  } catch (err) {
    next(err);
  }
};

const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    const userExist = _.find(
      workspace.users,
      (user) => user.userId === req.user_credentials.id
    );
    if (!userExist?.userId)
      throw createError(401, 'Not authorized to access this workspace resource.');

    res.status(200).json(workspace);
  } catch (err) {
    next(err);
  }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    Object.keys(req.body).forEach((key) => {
      if (
        key !== '_id' &&
        key !== '__v' &&
        key !== 'createdAt' &&
        key !== 'updatedAt' &&
        key !== 'id' &&
        key in workspace
      ) {
        workspace[key] = req.body[key];
      }
    });
    await workspace.save();
    res.status(200).json({ message: 'Workspace updated' });
  } catch (err) {
    next(err);
  }
};

const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    const userExist = _.find(
      workspace.users,
      (user) => user.userId === req.user_credentials.id
    );
    if (!userExist?.userId)
      throw createError(401, 'Not authorized to access this workspace resource.');
    const newUsers = _.filter(
      workspace.users,
      (user) => user.userId !== req.user_credentials.id
    );
    if (newUsers.length > 0) {
      workspace.users = newUsers;
      await workspace.save();
      return res.status(200).json({ message: 'User removed from workspace' });
    }
    if (workspace.owner !== req.user_credentials.id) {
      throw createError(401, 'Not authorized to delete this workspace.');
    }
    const boards = workspace.boards;
    await workspace.remove();
    res.status(200).json({ message: 'Workspace deleted' });
    // Delete all boards in the workspace
    const promises = boards.map((board) => Board.findByIdAndDelete(board));
    await Promise.all(promises);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
