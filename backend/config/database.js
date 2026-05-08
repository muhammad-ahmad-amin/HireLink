const mongoose = require('mongoose');

const usersDB = mongoose.createConnection(process.env.MONGO_URI);
const jobsDB = mongoose.createConnection(process.env.MONGO_URI2);
const bidsDB = mongoose.createConnection(process.env.MONGO_URI3);

const bindEvents = (connection, name) => {
  connection.on('connected', () => console.log(`Connected to MongoDB (${name})`));
  connection.on('error', (err) => console.error(`MongoDB connection error (${name}):`, err.message));
};

bindEvents(usersDB, 'Users DB');
bindEvents(jobsDB, 'Jobs DB');
bindEvents(bidsDB, 'Bids DB');

module.exports = { usersDB, jobsDB, bidsDB };