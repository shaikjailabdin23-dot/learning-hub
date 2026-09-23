const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getProjects);
router.get('/:id', optionalAuth, getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
