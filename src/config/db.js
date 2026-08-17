const mongoose = require('mongoose');

mongoose.Types.Decimal128.prototype.toJSON = function() {
  return parseFloat(this.toString());
};

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = connectDB;
