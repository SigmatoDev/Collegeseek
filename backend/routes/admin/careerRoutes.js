const express = require("express");
const protect = require("../../middlewares/admin/authMiddleware");
const {
  listAdminCareers,
  getAdminCareerById,
  createCareer,
  updateCareer,
  toggleCareerPublishStatus,
  deleteCareer,
  listPublishedCareers,
  getPublishedCareerBySlug,
} = require("../../controllers/admin/careerController");

const router = express.Router();

router.get("/careers", listPublishedCareers);
router.get("/careers/by/slug", getPublishedCareerBySlug);

router.get("/admin/careers", protect, listAdminCareers);
router.post("/admin/careers", protect, createCareer);
router.get("/admin/careers/:id", protect, getAdminCareerById);
router.put("/admin/careers/:id", protect, updateCareer);
router.patch("/admin/careers/:id/publish", protect, toggleCareerPublishStatus);
router.delete("/admin/careers/:id", protect, deleteCareer);

module.exports = router;
