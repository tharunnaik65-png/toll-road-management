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
      try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected (remote)');
        return;
      } catch (remoteErr) {
        console.error('Remote MongoDB connection failed. Falling back to in-memory server... Error:', remoteErr && remoteErr.message ? remoteErr.message : remoteErr);
      }
    }

    // No MONGO_URI provided or remote connection failed — start an in-memory MongoDB
    if (!mongodInstance) {
      console.log('Starting in-memory MongoDB database...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
    }
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB in-memory server started successfully');
  } catch (err) {
    console.error('Critical database connection error:', err && err.message ? err.message : err);
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
