const Board = require('../models/Board');
const User = require('../models/User');

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const board = await Board.create({
      title,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
    });

    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all boards for the logged-in user
// @route   GET /api/boards
// @access  Private
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ "members.user": req.user._id });
    console.log("🔍 Boards found:", boards);
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Invite another user to this board
// @route   POST /api/boards/:boardId/invite
// @access  Private (owner only)
exports.inviteUserToBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email } = req.body; // Expecting 'email' key

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const inviter = board.members.find(m => m.user.equals(req.user._id));
    if (!inviter || inviter.role !== 'owner') {
      return res.status(403).json({ message: 'Only the board owner can invite users' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyMember = board.members.some(m =>
      m.user.equals(userToInvite._id)
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'User already a member' });
    }

    board.members.push({ user: userToInvite._id, role: 'member' });
    await board.save();

    res.json({
      message: 'User added to board',
      userId: userToInvite._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Get all members of a board
// @route   GET /api/boards/:boardId/members
// @access  Private (any member)
exports.getBoardMembers = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId).populate('members.user', 'name email');
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isMember = board.members.some(m =>
      m.user._id.equals(req.user._id)
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied: not a board member' });
    }

    // Return user info and roles
    const formattedMembers = board.members.map(m => ({
      _id: m.user._id,
      name: m.user.name,
      email: m.user.email,
      role: m.role
    }));

    res.json(formattedMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc Update a board
exports.updateBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ message: "Board not found" });

    // Only owner can rename
    if (!board.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the owner can update" });
    }

    board.title = title || board.title;
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ message: "Board not found" });

    if (!board.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the owner can delete" });
    }

    await board.deleteOne();
    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

