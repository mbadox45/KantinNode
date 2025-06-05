const express = require('express');
const router = express.Router();
const masterWaktuMakanController = require('../controllers/masterWaktuMakanController');
const authenticateToken = require('../middlewares/auth');

// GET semua waktu makan
router.get('/', authenticateToken, masterWaktuMakanController.getAllWaktuMakan);

// POST waktu makan baru
router.post('/', authenticateToken, masterWaktuMakanController.createWaktuMakan);

// PUT update waktu makan
router.put('/:id', authenticateToken, masterWaktuMakanController.updateWaktuMakan);

// DELETE waktu makan (opsional)
router.delete('/:id', authenticateToken, masterWaktuMakanController.deleteWaktuMakan || ((req, res) => res.status(501).send('Not Implemented')));

module.exports = router;
