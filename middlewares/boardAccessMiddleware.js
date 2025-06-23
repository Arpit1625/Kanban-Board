const Board = require('../models/Board');

exports.requireBoardMember = async (req, res, next) => {
  try {
    const boardId = req.params.boardId || req.body.boardId;

    if (!boardId) {
      return res.status(400).json({ message: 'Board ID is required' });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isMember = board.members.some(
      (member) => String(member.user) === String(req.user._id)
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: not a board member' });
    }

    req.board = board; // attach for controller use
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
