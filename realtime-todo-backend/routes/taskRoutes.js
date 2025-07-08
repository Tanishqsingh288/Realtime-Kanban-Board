const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  smartAssign
} = require('../controllers/taskController');

router.get('/', verifyToken, getTasks);

router.post('/', verifyToken, createTask);

router.put('/:id', verifyToken, updateTask);

router.delete('/:id', verifyToken, deleteTask);

router.post('/:id/smart-assign', verifyToken, smartAssign);

module.exports = router;
