import express from "express";

import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from "../controllers/application.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/apply",
  protect,
  applyForJob
);

router.get(
  "/my-applications",
  protect,
  getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  getJobApplications
);

router.patch(
  "/:id/status",
  protect,
  updateApplicationStatus
);

export default router;