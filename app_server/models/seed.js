const mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');
const path = require('path');

// Load trip data from JSON file
const tripsDataPath = path.join(__dirname, '../../data/trips.json');
const trips = JSON.parse(fs.readFileSync(tripsDataPath, 'utf8'));

const seedDB = async () => {
  try {
    // Remove existing records
    await Trip.deleteMany({});
    console.log('Existing trips removed');

    // Insert new records
    await Trip.insertMany(trips);
    console.log('Trips successfully seeded');

    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
};

seedDB();
