const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/datasource');
const { protect, isMember } = require('./middleware/auth');
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
app.use('/api/:workspaceId/boards', protect, isMember, require('./routes/board'));
app.use('/api/users', require('./routes/user'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// define glabal error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`.yellow.bold));
