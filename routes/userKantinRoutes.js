const express = require('express');
const router = express.Router();
const userKantinController = require('../controllers/userKantinController');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, userKantinController.getAllUserKantin);
router.post('/', authenticateToken, userKantinController.createUserKantin);
router.post('/cek-kartu', authenticateToken, userKantinController.cekKartu);
router.put('/:id', authenticateToken, userKantinController.updateUserKantin);
router.delete('/:id', authenticateToken, userKantinController.deleteUserKantin);

module.exports = router;
