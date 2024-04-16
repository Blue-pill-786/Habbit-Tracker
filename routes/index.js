const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController.js');



router.get('/', habitController.getWelcome)
router.get('/dashboard', habitController.getDashboard);
router.post('/user-view', habitController.changeView);
router.post('/dashboard', habitController.addHabit);
router.get('/favorite-habit', habitController.toggleFavorite);
router.get('/status-update', habitController.updateHabitStatus);
router.get('/remove', habitController.removeHabit);

module.exports = router;
