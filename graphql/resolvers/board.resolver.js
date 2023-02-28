const createError = require('http-errors');
const validator = require('validator');
const Board = require('../../models/Board');
const List = require('../../models/List');

module.exports = {
  createBoard: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated.');
    }
    const { name, description, workspaceId } = args.boardInput;
    const board = new Board({
      name,
      description,
      workspaceId,
      owner: req.currentUser.id,
      users: [{ userId: req.currentUser.id }],
    });
    const createdBoard = await board.save();
    return {
      ...createdBoard._doc,
      _id: createdBoard._id.toString(),
    };
  },
  getBoards: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated.');
    }
    const boards = await Board.find({
      $where: { users: { $elemMatch: { userId: req.currentUser.id } } },
    });
    return boards.map((board) => {
      return {
        ...board._doc,
        _id: board._id.toString(),
      };
    });
  },
  getBoard: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated.');
    }
    const board = await Board.findById(args.boardId);
    if (!board) {
      throw createError(404, 'Board not found.');
    }
    const isUserInBoard = board.users.some(
      (user) => user.userId.toString() === req.currentUser.id
    );
    if (!isUserInBoard) {
      throw createError(401, 'Not authorized.');
    }
    return {
      ...board._doc,
      _id: board._id.toString(),
    };
  },
  updateBoard: async (args, req) => {
    if (!req.isAuth) {
      throw createError(401, 'Not authenticated.');
    }
    const { name, description, workspaceId } = args.boardInput;
    const board = await Board.findById(req.params.boardId);
  },
  deleteBoard: async (args, req) => {},
  createList: async (args, req) => {},
  getLists: async (args, req) => {},
  updateBoardLists: async (args, req) => {},
  updateListById: async (args, req) => {},
  deleteListById: async (args, req) => {},
};
