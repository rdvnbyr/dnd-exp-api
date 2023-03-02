const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/datasource');
const { protect, protectGraphql } = require('./middleware/auth');
const swaggerDocument = require('./config/swagger.json');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('./graphql');
require('colors');

dotenv.config();

const app = express();

connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/workspaces', protect, require('./routes/workspace'));
app.use('/api/boards', protect, require('./routes/board'));
app.use('/api/users', require('./routes/user'));

// graphql routes and middleware
app.use('/graphql', protectGraphql);
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphql.schemas,
    rootValue: graphql.resolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.statusCode || 500;
      return { message: message, status: code, data: data };
    },
  })
);

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
  res.sendFile(path.join(__dirname, 'config', 'swagger.json'));
});

app.get('/ping', (req, res) => {
  const host = req.protocol + '://' + req.get('host') + '/api';
  res.json({
    status: 200,
    message: 'Welcome to the DnD Api',
    api: host,
    controllers: {
      workspaces: host + '/workspaces',
      boards: host + '/boards',
      users: host + '/users',
    },
  });
});

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on http://localhost:${PORT}`.magenta.bold);
  }
});
