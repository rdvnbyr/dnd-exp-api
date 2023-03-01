const Board = require('../models/board');
const Workspace = require('../models/workspace');
const createError = require('http-errors');
const validator = require('validator');

const createBoard = async (req, res, next) => {
  try {
    const { workspaceId, ...restBody } = req.body;
    if (validator.isEmpty(workspaceId)) {
      throw createError(400, 'Invalid workspace id');
    }
    const workspace = await Worksppace.findById(workspaceId);
    if (!workspace) {
      throw createError(404, 'Workspace not found');
    }
    if (!workspace.users.find((user) => user.userId == req.currentUser.id)) {
      throw createError(401, 'Not authorized to access this workspace resource.');
    }
    
    const board = new Board({
      ...restBody,
      workspaceId,
      owner: req.currentUser.id,
      users: [{ userId: req.currentUser.id }],
    });
    await board.save();
    await Workspace.findById();
    res.status(200).json({ message: 'Board created' });
  } catch (err) {
    next(err);
  }
};

const getBoards = async (req, res, next) => {
  try {
    const filter = {
      users: {
        $elemMatch: {
          userId: req.currentUser.id,
        },
      },
      ...(req.query.workspaceId && { workspaceId: req.query.workspaceId }),
    };
    const boards = await Board.find(filter).populate('workspaceId');
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
};

const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId).populate('workspaceId');
    if (!board) {
      throw createError(404, 'Board not found');
    }
    if (
      !board.users.find((user) => user.userId.toString() == req.currentUser.id.toString())
    ) {
      throw createError(401, 'Not authorized to access this board resource.');
    }
    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
    }
    Object.assign(board, req.body);
    await board.save();
    res.status(200).json({ message: 'Board updated' });
  } catch (err) {
    next(err);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
    }
    if (
      !board.users.find((user) => user.userId.toString() == req.currentUser.id.toString())
    ) {
      throw createError(401, 'Not authorized to access this board resource.');
    }
    await board.remove();
    res.status(200).json({ message: 'Board deleted' });
  } catch (err) {
    next(err);
  }
};

const createList = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
    }
    if (
      !board.users.find((user) => user.userId.toString() == req.currentUser.id.toString())
    ) {
      throw createError(401, 'Not authorized to access this board resource.');
    }
    board.lists.push(req.body);
    await board.save();

    res.status(200).json({ message: 'List created' });
  } catch (err) {
    next(err);
  }
};

const updateListById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
    }
    if (
      !board.users.find((user) => user.userId.toString() == req.currentUser.id.toString())
    ) {
      throw createError(401, 'Not authorized to access this board resource.');
    }
    const list = board.lists.id(req.params.listId);
    if (!list) {
      throw createError(404, 'List not found');
    }
    Object.assign(list, req.body);
    await board.save();
    res.status(200).json({ message: 'List updated' });
  } catch (err) {
    next(err);
  }
};

const updateLists = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
    }
    if (
      !board.users.find((user) => user.userId.toString() == req.currentUser.id.toString())
    ) {
      throw createError(401, 'Not authorized to access this board resource.');
    }
    board.lists = req.body;
    await board.save();
    res.status(200).json({ message: 'Lists updated' });
  } catch (err) {
    next(err);
  }
};

const deleteListById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
    }
    if (
      !board.users.find((user) => user.userId.toString() == req.currentUser.id.toString())
    ) {
      throw createError(401, 'Not authorized to access this board resource.');
    }
    const list = board.lists.id(req.params.listId);
    if (!list) {
      throw createError(404, 'List not found');
    }
    list.remove();
    await board.save();
    res.status(200).json({ message: 'List deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  createList,
  updateListById,
  updateLists,
  deleteListById,
};
