const createError = require('http-errors');
const validator = require('validator');
const Board = require('../../models/board');
const Workspace = require('../../models/workspace');
const jwtService = require('../../services/jwt');

module.exports = {
  createWorkspace: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated');
    }
    const errors = [];
    const { name, description } = args.workspaceInput;
    if (validator.isEmpty(name) || !validator.isLength(name, { min: 3 })) {
      errors.push('Name is not valid');
    }
    if (errors.length > 0) {
      const error = createError(400, 'Invalid input data');
      error.data = errors;
      throw error;
    }
    // check name is unique
    const nameIsExist = await Workspace.findOne({ name: name });
    if (nameIsExist) {
      throw createError(400, 'Workspace name is already exist');
    }
    const workspace = new Workspace({
      name: name,
      description: description,
      owner: req.currentUser.id,
      boards: [],
    });
    const createdWorkspace = await workspace.save();
    return { ...createdWorkspace._doc, _id: createdWorkspace._id.toString() };
  },

  getWorkspaces: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated');
    }
    const workspaces = await Workspace.find({ owner: req.currentUser.id });
    return workspaces.map((workspace) => ({
      ...workspace._doc,
      _id: workspace._id.toString(),
    }));
  },

  getWorkspace: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated');
    }
    const workspace = await Workspace.findById(args.workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    if (workspace.owner.toString() !== req.currentUser.id) {
      throw createError(401, 'Not authorized');
    }
    return { ...workspace._doc, _id: workspace._id.toString() };
  },

  updateWorkspace: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated');
    }
    const errors = [];
    const { name, description } = args.workspaceInput;
    if (validator.isEmpty(name) || !validator.isLength(name, { min: 3 })) {
      errors.push('Name is not valid');
    }
    if (errors.length > 0) {
      const error = createError(400, 'Invalid input data');
      error.data = errors;
      throw error;
    }
    const workspace = await Workspace.findById(args.workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    if (workspace.owner.toString() !== req.currentUser.id) {
      throw createError(401, 'Not authorized');
    }
    workspace.name = name;
    workspace.description = description;
    const updatedWorkspace = await workspace.save();
    return { ...updatedWorkspace._doc, _id: updatedWorkspace._id.toString() };
  },

  deleteWorkspace: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated');
    }
    const workspace = await Workspace.findById(args.workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    if (workspace.owner.toString() !== req.currentUser.id.toString()) {
      throw createError(401, 'Not authorized');
    }
    await Workspace.findByIdAndDelete(args.workspaceId);
    await Board.deleteMany({ workspaceId: args.workspaceId });
    return {
      message: 'Workspace deleted successfully',
    };
  },
};
