const express = require('express');
const router = express.Router();
const masterKartuController = require('../controllers/masterKartuController');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, masterKartuController.getAllKartu);
router.get('/:id', authenticateToken, masterKartuController.getKartuById);
router.post('/', authenticateToken, masterKartuController.createKartu);
router.put('/:id', authenticateToken, masterKartuController.updateKartu);

module.exports = router;
