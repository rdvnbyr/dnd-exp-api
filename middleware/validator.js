const { body } = require('express-validator');

const validateWorkspace = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Please add a name')
    .isLength({ max: 50 })
    .withMessage('Name can not be more than 50 characters'),

  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description can not be more than 500 characters'),

  body('users').isArray().withMessage('Users must be an array'),

  body('boards').isArray().withMessage('Boards must be an array'),

  body('owner').notEmpty().isMongoId().withMessage('Owner ID must be a valid Mongo ID'),
];

module.exports = {
  validateWorkspace,
};
