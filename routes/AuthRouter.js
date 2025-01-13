const express = require('express');
const { signup, login, requestPasswordReset } = require('../controllers/Auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', requestPasswordReset);

module.exports = router;
