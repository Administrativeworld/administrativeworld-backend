// routes/couponRoutes.js
import express from "express";
import { 
  validateCoupon, 
  createCoupon,
  getCouponByCodeName,
  updateCouponByCodeName,
  deleteCouponByCodeName,
  toggleCouponStatusByCodeName,
  getAllCoupons
} from "../controllers/CouponCode.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ✅ Register static routes first
router.get("/getallcoupons", auth, isAdmin, getAllCoupons);

router.post("/validate", validateCoupon);
router.post("/createcouponcode", auth, isAdmin, createCoupon);
router.get("/:codeName", auth, isAdmin, getCouponByCodeName);
router.post("/:codeName", auth, isAdmin, updateCouponByCodeName);
router.delete("/:codeName", auth, isAdmin, deleteCouponByCodeName);
router.post("/:codeName/toggle-status", auth, isAdmin, toggleCouponStatusByCodeName);

export default router;
