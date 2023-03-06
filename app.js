const express = require('express');
const path = require('path');
const fs = require('fs').promises;
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
const Feedback = require('./models/feedback');
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

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/feedback', 'index.html'));
});

app.post('/feed/create', async (req, res) => {
  try {
    const { title, email, comment } = req.body;
    if (!title || !email || !comment) {
      return res.redirect('/feedback/error');
    }
    // const data = await fs.readFile(__dirname + '/data/feedback.json', 'utf8');
    // if (!data) {
    //   await fs.writeFile(__dirname + '/data/feedback.json', JSON.stringify([feedback]));
    // } else {
    //   const feedbacks = JSON.parse(data);
    //   if (feedbacks.find((fb) => fb.email === email)) {
    //     return res.redirect('/feedback/error');
    //   }
    //   feedbacks.push(feedback);
    //   await fs.writeFile(__dirname + '/data/feedback.json', JSON.stringify(feedbacks));
    // }
    const feedback = new Feedback({
      title,
      email,
      comment,
    });
    await feedback.save();
    res.redirect('/feedback/success');
  } catch (error) {
    res.redirect('/feedback/error');
  }
});

app.get('/feedback/success', (req, res) => {
  // res.sendFile(path.join(__dirname, 'data', 'feedback.json'));
  res.sendFile(path.join(__dirname, 'public/feedback', 'success.html'));
});
app.get('/feedback/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/feedback', 'error.html'));
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
