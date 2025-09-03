// routes/itemCategoryRoute.js
const express = require('express');
const router = express.Router();
const itemCategoryController = require('../controllers/itemCategoryController');

router.get('/', itemCategoryController.getAllCategories);
router.post('/', itemCategoryController.createCategory);
router.put('/:id', itemCategoryController.updateCategory);
router.delete('/:id', itemCategoryController.deleteCategory);

module.exports = router;
