const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const {
  createBanner,
  getBanners,
  getBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.route("/")
  .post(protect, restrictTo("admin"), createBanner)
  .get(getBanners);

router.route("/:id")
  .get(getBanner)
  .put(updateBanner)
  .delete(deleteBanner);

module.exports = router;
