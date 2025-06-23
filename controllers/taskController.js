const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, columnId, description, order, assignedTo, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      column: columnId,
      description: description || '',
      order: order || 0,
      assignedTo: assignedTo || null,
      status: status || 'todo',
      dueDate: dueDate || null,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks for a column
exports.getTasksByColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const tasks = await Task.find({ column: columnId })
      .sort({ order: 1 })
      .populate('assignedTo', 'name email');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const { assignedTo, column, keyword } = req.query;

    const query = {};

    if (assignedTo) query.assignedTo = assignedTo;
    if (column) query.column = column;
    if (keyword) query.title = { $regex: keyword, $options: 'i' };

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reorderTasks = async (req, res) => {
  const { columnId } = req.params;
  const { taskIds } = req.body;

  try {
    for (let i = 0; i < taskIds.length; i++) {
      await Task.findByIdAndUpdate(taskIds[i], { order: i });
    }
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
