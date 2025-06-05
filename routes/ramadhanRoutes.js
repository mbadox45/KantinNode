const express = require('express');
const router = express.Router();
const ramadhanController = require('../controllers/ramadhanController');
const authenticateToken = require('../middlewares/auth');

router.get('/',authenticateToken, ramadhanController.getAllRamadhan);
router.post('/',authenticateToken, ramadhanController.createRamadhan);
router.put('/:id',authenticateToken, ramadhanController.updateRamadhan); // ← tambahkan ini

module.exports = router;
