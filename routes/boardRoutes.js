const express = require('express');
const router = express.Router();
const { getBoardById } = require('../controllers/boardController');
const { createBoard, getBoards, inviteUserToBoard, getBoardMembers, updateBoard, deleteBoard } = require('../controllers/boardController');

const { protect } = require('../middlewares/authMiddleware');
const { requireBoardMember } = require('../middlewares/boardAccessMiddleware');

// Debug (optional)
console.log('🧪 controller:', {
  createBoard,
  getBoards,
  inviteUserToBoard,
  getBoardMembers
});

// ✅ Member-only routes
router.get('/:boardId/members', protect, requireBoardMember, getBoardMembers);
router.post('/:boardId/invite', protect, requireBoardMember, inviteUserToBoard);

// ✅ General routes
router.route('/')
  .post(protect, createBoard)
  .get(protect, getBoards);

router.get('/:id', protect, getBoardById);

router
  .route('/:id')
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);
  
module.exports = router;
