const Category = require('../models/Category');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc   Create category
 * @route  POST /api/categories
 * @access Admin
 */
exports.createCategory = catchAsync(async (req, res, next) => {

  const { name } = req.body;

  if (!name) {
    return next(new appError('Category name is required', 400));
  }

  const category = await Category.create({ name });

  res.status(201).json({
    status: 'success',
    data: category,
  });
});

/**
 * @desc   Get all categories
 * @route  GET /api/categories
 * @access Public
 */
exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories,
  });
});

/**
 * @desc   Get single category
 * @route  GET /api/categories/:id
 * @access Public
 */
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new appError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

/**
 * @desc   Update category
 * @route  PATCH /api/categories/:id
 * @access Admin
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    return next(new appError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

/**
 * @desc   Delete category
 * @route  DELETE /api/categories/:id
 * @access Admin
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new appError('Category not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
