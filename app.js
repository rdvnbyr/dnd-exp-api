const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/datasource');
const { protect } = require('./middleware/auth');
const swaggerDocument = require('./config/swagger.json');
require('colors');

dotenv.config();

const app = express();

// Connect to database
db();

// use cors
app.use(cors());

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/workspaces', protect, require('./routes/workspace'));
app.use('/api/boards', protect, require('./routes/board'));
app.use('/api/users', require('./routes/user'));

// define glabal error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// create swagger docs
const swaggerUi = require('swagger-ui-express');
app.use(
  '/explorer',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  })
);
app.get('/open-api', (req, res) => {
  res.sendFile(path.join(__dirname, 'config', "swagger.json" ));
});

app.get('/ping', (req, res) => {
  res.json({
    message: 'Welcome to the Dart Api',
    status: 'success',
    data: null,
    request: req.ip + ' ' + req.method + ' ' + req.originalUrl,
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`.yellow.bold));
