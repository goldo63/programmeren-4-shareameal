const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

authRouter.post('/api/auth/login', authController.login);
authRouter.post('/api/auth/verify', authController.validateLogin);

module.exports = authRouter;