const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getTimers,
  undoLastAction,
  startOrResetTimer,
  stopTimer,
} = require('../controllers/timers');

// Define routes and associate them with the controller functions
router.get('/timers', getTimers); // Get all timers
router.post('/timers/', startOrResetTimer); // Start or reset a specific timer
router.post('/timers/stop/', stopTimer); // Stop a specific timer
router.post('/timers/undo/', undoLastAction); // Stop a specific timer


module.exports = router;