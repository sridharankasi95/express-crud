const Banner = require("../models/Banner");


// CREATE
exports.createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);

  res.status(201).json({
    success: true,
    data: banner,
  });
};

// GET ALL
exports.getBanners = async (req, res) => {
  const banners = await Banner.find();

  res.json({
    success: true,
    data: banners,
  });
};

// GET SINGLE
exports.getBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return res.status(404).json({ message: "Banner not found" });
  }

  res.json({
    success: true,
    data: banner,
  });
};

// UPDATE
exports.updateBanner = async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: banner,
  });
};

// DELETE
exports.deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Banner deleted",
  });
};
