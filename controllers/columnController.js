const Column = require('../models/Column');

// @desc    Create a new column
exports.createColumn = async (req, res) => {
  try {
    const { title, board, order } = req.body;

    if (!title || !board) {
      return res.status(400).json({ message: "Title and board ID are required" });
    }

    const column = await Column.create({
      title,
      board,
      order: order || 0,
    });

    res.status(201).json(column);
  } catch (err) {
    console.error("❌ Error creating column:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all columns for a board
exports.getColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await Column.find({ board: boardId }).sort({ order: 1 });

    res.json(columns);
  } catch (err) {
    console.error("❌ Error fetching columns:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a column
exports.updateColumn = async (req, res) => {
  try {
    const { title } = req.body;

    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: "Column not found" });

    column.title = title || column.title;
    await column.save();

    res.json(column);
  } catch (err) {
    console.error("❌ Error updating column:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a column
exports.deleteColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column) return res.status(404).json({ message: "Column not found" });

    res.json({ message: "Column deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting column:", err);
    res.status(500).json({ message: err.message });
  }
};


