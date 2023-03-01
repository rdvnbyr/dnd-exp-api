const Attachment = require('../models/Attachment');

module.exports = {
  uploadFile: async (req, res) => {
    try {
      const attachment = new Attachment({
        name: req.file.originalname,
        path: req.file.path,
      });
      await attachment.save();
      res.status(201).json({ message: 'File uploaded' });
    } catch (err) {
      next(err);
    }
  },
};
