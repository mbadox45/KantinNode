const express = require('express');
const router = express.Router();
const masterShiftController = require('../controllers/masterShiftController');
const authenticateToken = require('../middlewares/auth');

router.get('/',authenticateToken, masterShiftController.getAllShift);
router.post('/',authenticateToken, masterShiftController.createShift);
router.put('/:id',authenticateToken, masterShiftController.updateShift); // Tambahan route update

module.exports = router;
