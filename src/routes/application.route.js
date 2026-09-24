import express from "express";
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, applyForJob);

router.get("/my", protect, getMyApplications);

router.get("/job/:jobId", protect, getJobApplications);

router.patch(
  "/:applicationId/status",
  protect,
  updateApplicationStatus
);

export default router;