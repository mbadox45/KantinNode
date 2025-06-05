const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, visitorController.getAllVisitors);
router.post('/', authenticateToken, visitorController.createVisitor);
router.put('/:id', authenticateToken, visitorController.updateVisitor);
router.get('/periode', visitorController.getVisitorsByPeriod);
router.delete('/:id', authenticateToken, visitorController.deleteVisitor);

module.exports = router;
