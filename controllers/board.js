const Board = require('../models/board');
const createError = require('http-errors');

const createBoard = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const board = new Board({ ...req.body, workspace: workspaceId });
    await board.save();
    res.status(200).json({ message: 'Board created' });
  } catch (err) {
    next(err);
  }
};

const getBoards = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const boards = await Board.find({ workspace: workspaceId });
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
};

const getBoard = async (req, res, next) => {
  try {
    // const { workspaceId } = req.params;
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      throw createError(404, 'Board not found');
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
