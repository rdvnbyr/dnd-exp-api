const mongoose = require('mongoose');

const connectDB = async (req, res, next) => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) =>
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
    )
    .catch((err) => console.error(`Error: ${err.message}`.red))
    .finally(() => mongoose.connection.close());
};

module.exports = connectDB;
