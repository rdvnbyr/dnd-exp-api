const fs = require('fs');
const path = require('path');
const userRoute = require('./routes/user');
const workspaceRoute = require('./routes/workspace');
const boardRoute = require('./routes/board');

module.exports = (req, res, next) => {
  console.log('Swagger Feed');

  console.log('Path: swagger-feed.js', __dirname);

  const swaggerDocument = {};
  const docs = [];
  workspaceRoute.stack.forEach((layer) => {
    console.log(typeof layer.route);
    if (layer.route) {
      docs.push(layer.route);
    }
  });

  res.json(docs);
  // res.json(userRoute.stack);
};
