import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  getMyJobs
} from "../controllers/job.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  getAllJobs
);

router.get(
  "/my-jobs",
  protect,
  getMyJobs
);

router.get(
  "/:id",
  getJobById
);

router.post(
  "/",
  protect,
  createJob
);

router.delete(
  "/:id",
  protect,
  deleteJob
);

export default router;