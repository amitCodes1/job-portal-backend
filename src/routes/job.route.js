import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  getMyJobs,
  updateJob

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

router.put(
  "/:id",
  protect,
  updateJob
);

router.delete(
  "/:id",
  protect,
  deleteJob
);

export default router;