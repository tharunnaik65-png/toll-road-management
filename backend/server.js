const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // seed admin user and operational database
  const User = require('./models/User');
  const Vehicle = require('./models/Vehicle');
  const Transaction = require('./models/Transaction');
  const bcrypt = require('bcryptjs');
  
  (async ()=>{
    try {
      console.log('Initializing database tables for Tarun...');
      
      // Clear existing records to ensure a fresh, consistent seed
      await User.deleteMany({});
      await Vehicle.deleteMany({});
      await Transaction.deleteMany({});
      
      // 1. Seed Admin User
      const hash = await bcrypt.hash('tarun7204', 10);
      await User.create({ name: 'Tarun Kumar', email: 'tarun@gmail.com', password: hash, role: 'admin' });
      console.log('Seeded admin user: tarun@gmail.com / tarun7204');

      // 2. Seed 3 Cars, 3 Bikes, and 2 Trucks
      console.log('Seeding vehicle directory...');
      const seededVehicles = [
        // 3 Cars
        { plate: 'MH12AB1234', type: 'car', owner: 'Tarun Kumar', fastagId: 'FTAG-CAR-8821', notes: 'Linked to admin profile' },
        { plate: 'KA03CD5678', type: 'car', owner: 'Rohan Sharma', fastagId: 'FTAG-CAR-1144', notes: 'Frequent corporate corridor pass' },
        { plate: 'DL01EF9012', type: 'car', owner: 'Priya Patel', fastagId: null, notes: 'Non-RFID passenger sedan' },
        
        // 3 Bikes
        { plate: 'MH14XY5678', type: 'bike', owner: 'Amit Patel', fastagId: null, notes: 'Local motorcycle lane permit' },
        { plate: 'HR26AB9999', type: 'bike', owner: 'Sonal Sen', fastagId: null, notes: 'Two-wheeler daily toll pass' },
        { plate: 'UP16CD1111', type: 'bike', owner: 'Rahul Singh', fastagId: null, notes: 'Commuter bike record' },
        
        // 2 Trucks
        { plate: 'MH15JK4444', type: 'truck', owner: 'Logistics Ltd', fastagId: 'FTAG-TRK-7711', notes: 'Heavy logistic shipping carrier' },
        { plate: 'GJ01LM2222', type: 'truck', owner: 'Express Cargo', fastagId: 'FTAG-TRK-9900', notes: 'Inter-state cargo delivery fleet' }
      ];

      const createdVehicles = await Vehicle.create(seededVehicles);
      console.log(`Successfully seeded ${createdVehicles.length} vehicles.`);

      // 3. Seed Corresponding Transaction Ledger
      console.log('Seeding live transaction records...');
      const shortid = require('shortid');
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      const seedTransactions = [
        // Closed (Paid) Transactions
        {
          vehicle: createdVehicles[0]._id, // MH12AB1234
          plate: 'MH12AB1234',
          entryTime: new Date(now - 45 * 60 * 1000),
          exitTime: new Date(now - 15 * 60 * 1000),
          amount: 50,
          paymentMethod: 'fastag',
          status: 'closed',
          receiptId: shortid.generate()
        },
        {
          vehicle: createdVehicles[1]._id, // KA03CD5678
          plate: 'KA03CD5678',
          entryTime: new Date(now - 120 * 60 * 1000),
          exitTime: new Date(now - 60 * 60 * 1000),
          amount: 50,
          paymentMethod: 'fastag',
          status: 'closed',
          receiptId: shortid.generate()
        },
        {
          vehicle: createdVehicles[3]._id, // MH14XY5678
          plate: 'MH14XY5678',
          entryTime: new Date(now - 30 * 60 * 1000),
          exitTime: new Date(now - 10 * 60 * 1000),
          amount: 20,
          paymentMethod: 'cash',
          status: 'closed',
          receiptId: shortid.generate()
        },
        {
          vehicle: createdVehicles[6]._id, // MH15JK4444
          plate: 'MH15JK4444',
          entryTime: new Date(yesterday - 6 * 60 * 60 * 1000),
          exitTime: new Date(yesterday - 4 * 60 * 60 * 1000),
          amount: 120,
          paymentMethod: 'fastag',
          status: 'closed',
          receiptId: shortid.generate()
        },
        {
          vehicle: createdVehicles[7]._id, // GJ01LM2222
          plate: 'GJ01LM2222',
          entryTime: new Date(yesterday - 8 * 60 * 60 * 1000),
          exitTime: new Date(yesterday - 6 * 60 * 60 * 1000),
          amount: 120,
          paymentMethod: 'cash',
          status: 'closed',
          receiptId: shortid.generate()
        },
        
        // Open Transactions (Active in Corridor)
        {
          vehicle: createdVehicles[2]._id, // DL01EF9012
          plate: 'DL01EF9012',
          entryTime: new Date(now - 20 * 60 * 1000),
          status: 'open',
          receiptId: shortid.generate()
        },
        {
          vehicle: createdVehicles[4]._id, // HR26AB9999
          plate: 'HR26AB9999',
          entryTime: new Date(now - 10 * 60 * 1000),
          status: 'open',
          receiptId: shortid.generate()
        }
      ];

      const createdTrx = await Transaction.create(seedTransactions);
      console.log(`Successfully seeded ${createdTrx.length} transaction logs.`);
      console.log('Database initialized successfully.');
    } catch(e) {
      console.error('Database seeding error:', e);
    }
  })();
});
