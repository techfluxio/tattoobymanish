const Category = require('../models/Category');

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, categories: cats });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories  (protected)
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const cat = await Category.create({ name: name.trim().slice(0, 50) });
    res.status(201).json({ success: true, category: cat });
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id  (protected)
const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim().slice(0, 50) },
      { new: true, runValidators: true }
    );
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category: cat });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id  (protected)
const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
