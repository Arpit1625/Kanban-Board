const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByColumn,
  updateTask,
  deleteTask,
  searchTasks,
  reorderTasks
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createTask); // POST /api/tasks

router.get('/search/tasks', protect, searchTasks); // ✅ GET /api/tasks/search/tasks

router.get('/:columnId', protect, getTasksByColumn); // GET /api/tasks/:columnId

router.put('/reorder/:columnId', protect, reorderTasks); // ✅ PUT /api/tasks/reorder/:columnId

router
  .route('/:id')
  .put(protect, updateTask) // PUT /api/tasks/:id
  .delete(protect, deleteTask); // DELETE /api/tasks/:id

module.exports = router;
