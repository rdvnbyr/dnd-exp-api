const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  createList,
  updateListById,
  updateLists,
  deleteListById,
} = require('../controllers/board');

/**
 * @route   POST api/:workspaceId/boards
 * @desc    Create a board
 * @access  Private (token required)
 * @returns {message} string message
 */
router.post('/', createBoard);

/**
 * @route   GET api/boards
 * @desc    Get all boards
 * @access  Private (token required)
 * @returns {boards} array of boards
 */
router.get('/', getBoards);

/**
 * @route   GET api/boards/:boardId
 * @desc    Get a board
 * @access  Private (token required)
 * @returns {board} board object
 */
router.get('/:boardId', getBoard);

/**
 * @route   PATCH api/boards/:boardId
 * @desc    Update a board
 * @access  Private (token required)
 * @returns {message} string message
 * @returns {error} 404 if board not found
 */
router.patch('/:boardId', updateBoard);

/**
 * @route   DELETE api/boards/:boardId
 * @desc    Delete a board
 * @access  Private (token required) - user can only delete his own boards
 * @returns {message} string message
 */
router.delete('/:boardId', deleteBoard);

/**
 * @route   POST api/boards/:boardId/lists
 * @desc    Create a list
 * @access  Private (token required)
 * @returns {message} string message
 */
router.post('/:boardId/lists', createList);

/**
 * @route   PATCH api/boards/:boardId/lists/:listId
 * @desc    Update a list
 * @access  Private (token required)
 * @returns {message} string message
 */
router.patch('/:boardId/lists/:listId', updateListById);

/**
 * @route   PATCH api/boards/:boardId/lists
 * @desc    Update lists
 * @access  Private (token required)
 * @returns {message} string message
 */
router.patch('/:boardId/lists', updateLists);

/**
 * @route   DELETE api/boards/:boardId/lists/:listId
 * @desc    Delete a list
 * @access  Private (token required)
 * @returns {message} string message
 */
router.delete('/:boardId/lists/:listId', deleteListById);

module.exports = router;
