const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
    order: { type: Number, default: 0 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    done: { type: Boolean, default: false },
    status: { type: String, enum: ['todo', 'in progress', 'blocked', 'done'], default: 'todo' },
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
