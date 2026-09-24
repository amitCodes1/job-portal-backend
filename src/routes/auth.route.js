import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  uploadResume,
   updateProfile
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutUser);

router.get("/me", protect, getMe);
router.put(
  "/profile",
  protect,
  updateProfile
);

router.post(
  "/resume",
  protect,
  upload.single("file"),
  uploadResume
);

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You can access this protected route",
    user: req.user
  });
});

export default router;