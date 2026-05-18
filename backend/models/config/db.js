const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let mongodInstance = null;

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  const MONGO_URI = process.env.MONGO_URI;
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected (remote)');
      return;
    }

    // No MONGO_URI provided — start an in-memory MongoDB for development
    if (!mongodInstance) {
      console.log('No MONGO_URI provided — starting in-memory MongoDB');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
    }
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB in-memory server started');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  }
};

const stopDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) await mongodInstance.stop();
  } catch (e) { console.error('Error stopping DB', e) }
};

module.exports = connectDB;
module.exports.stopDB = stopDB;
