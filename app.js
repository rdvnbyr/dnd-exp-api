const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
require('colors');

dotenv.config();

const app = express();

const db = require('./config/datasource');
db();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`.yellow.bold));
