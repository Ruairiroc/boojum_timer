const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getTimers,
  startOrResetTimer,
  stopTimer,
} = require('../controllers/timers');

// Define routes and associate them with the controller functions
router.get('/timers', getTimers); // Get all timers
router.post('/timers/:index', startOrResetTimer); // Start or reset a specific timer
router.delete('/timers/:index', stopTimer); // Stop a specific timer

module.exports = router;