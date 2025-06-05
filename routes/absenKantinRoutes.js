const express = require('express');
const router = express.Router();
const absenKantinController = require('../controllers/absenKantinController');
const authenticateToken = require('../middlewares/auth');

// Route untuk melakukan tap absen
router.post('/tap', absenKantinController.tapAbsen);

// Route untuk mendapatkan semua data absen
router.get('/', authenticateToken, absenKantinController.getAll);
router.get('/all', absenKantinController.getAllAbsenKantin);

// Route untuk mendapatkan data absen berdasarkan periode
router.get('/periode', absenKantinController.getByPeriod);

module.exports = router;
