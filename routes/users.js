

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/login', userController.showLoginPage);
router.get('/register', userController.showRegisterPage);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

module.exports = router;
