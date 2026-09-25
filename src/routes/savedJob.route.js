import express from "express";

import {
  saveJob,
  getSavedJobs,
  removeSavedJob
} from "../controllers/savedJob.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  saveJob
);

router.get(
  "/",
  protect,
  getSavedJobs
);

router.delete(
  "/:jobId",
  protect,
  removeSavedJob
);

export default router;