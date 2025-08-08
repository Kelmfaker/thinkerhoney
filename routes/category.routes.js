const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// إنشاء صنف جديد
router.post('/', categoryController.createCategory);

// جلب كل الأصناف
router.get('/', categoryController.getCategories);

// جلب صنف معين
router.get('/:id', categoryController.getCategoryById);

// تعديل صنف
router.put('/:id', categoryController.updateCategory);

// حذف صنف
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;