const express = require('express');
const router = express.Router();

const { validateWorkspace } = require('../middleware/validator');

const {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} = require('../controllers/workspace');

/**
 * @route   POST api/workspaces
 * @desc    Create a workspace
 * @access  Private (token required)
 * @returns {message} string message
 */
router.post('/', validateWorkspace, createWorkspace);

/**
 * @route   GET api/workspaces
 * @desc    Get all workspaces
 * @access  Private (token required)
 * @returns {workspaces} array of workspaces
 */
router.get('/', getWorkspaces);

/**
 * @route   GET api/workspaces/:workspaceId
 * @desc    Get a workspace
 * @access  Private (token required)
 * @returns {workspace} workspace object
 * @returns {error} 404 if workspace not found
 */
router.get('/:workspaceId', getWorkspace);

/**
 * @route   PATCH api/workspaces/:workspaceId
 * @desc    Update a workspace
 * @access  Private (token required)
 * @returns {message} string message
 * @returns {error} 404 if workspace not found
 */
router.patch('/:workspaceId', updateWorkspace);

/**
 * @route   DELETE api/workspaces/:workspaceId
 * @desc    Delete a workspace
 * @access  Private (token required) - user can only delete his own workspaces
 * @returns {message} string message
 */
router.delete('/:workspaceId', deleteWorkspace);

module.exports = router;
