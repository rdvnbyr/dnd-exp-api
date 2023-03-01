const fs = require('fs');
const path = require('path');
const userRoute = require('./routes/user');
const workspaceRoute = require('./routes/workspace');
const boardRoute = require('./routes/board');

console.log('Path: swagger-feed.js', __dirname);

userRoute.stack.forEach((layer) => {
  console.log(layer.route);
});
