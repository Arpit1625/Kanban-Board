const express = require('express');
const router = express.Router();
const {
  createColumn,
  getColumnsByBoard,
  updateColumn,
  deleteColumn
} = require('../controllers/columnController');
const { protect } = require('../middlewares/authMiddleware');

// ✅ Create column
router.post('/', protect, createColumn);

// ✅ Update & delete (put/delete by ID) - using /edit/:id to avoid conflict
router.put('/edit/:id', protect, updateColumn);
router.delete('/edit/:id', protect, deleteColumn);

// ✅ Get columns for a board - place last
router.get('/board/:boardId', protect, getColumnsByBoard);

module.exports = router;
