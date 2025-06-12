import express from "express";
import { 
    validateCoupon, 
    createCoupon,
    getCouponByCodeName,
    updateCouponByCodeName,
    deleteCouponByCodeName,
    toggleCouponStatusByCodeName
} from "../controllers/CouponCode.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();
router.post("/validate", validateCoupon);
router.post("/createcouponcode", auth, isAdmin, createCoupon);
router.get("/:codeName",auth,isAdmin, getCouponByCodeName);
router.post("/:codeName", auth,isAdmin,updateCouponByCodeName);
router.delete("/:codeName", auth,isAdmin,deleteCouponByCodeName);
router.post("/:codeName/toggle-status", auth,isAdmin, toggleCouponStatusByCodeName);
export default router;


// {
//   "couponCode": "SAVE20",
//   "courseId": "664fc9c6b4bdf473471a3fd9",
//   "userId": "664fb5ff2c1c3f3713d2aabc"
// }
