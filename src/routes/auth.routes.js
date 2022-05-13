const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

authRouter.post('/api/auth/login', authController.login);

module.exports = authRouter;