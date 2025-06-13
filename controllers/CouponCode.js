import Coupon from "../models/CouponCode.js";
import Course from "../models/Course.js";
import User from "../models/UserModel.js";

export const validateCoupon = async (req, res) => {
  const { couponCode, courseId, userId } = req.body;

  if (!couponCode || !courseId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Coupon code, course ID, and user ID are required"
    });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const coupon = await Coupon.findOne({ codeName: couponCode.toUpperCase() });
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: "Invalid or inactive coupon" });
    }

    if (coupon.expirationDate && new Date() > coupon.expirationDate) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    if (coupon.usedByUsers.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({ success: false, message: "Coupon already used by this user" });
    }

    if (coupon.whiteListedUsers.length > 0 &&
        !coupon.whiteListedUsers.some(id => id.toString() === userId.toString())) {
      return res.status(403).json({ success: false, message: "You are not allowed to use this coupon" });
    }

    let finalPrice = course.price;
    let discount = 0;

    if (coupon.discountType === "PercentOff") {
      discount = Math.round(finalPrice * (coupon.discountValue / 100));
    } else if (coupon.discountType === "RupeesOff") {
      discount = Math.round(coupon.discountValue);
    }

    finalPrice = Math.max(0, finalPrice - discount);

    return res.status(200).json({
      success: true,
      message: "Coupon valid",
      originalPrice: course.price,
      finalPrice,
      discount,
      coupon: {
        codeName: coupon.codeName,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon"
    });
  }
};

// Create coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      codeName,
      couponType,
      discountType,
      discountValue,
      maxUsageLimit,
      expirationDate,
    } = req.body;
    console.log( codeName,
      couponType,
      discountType,
      discountValue,
      maxUsageLimit,
      expirationDate,);

    if (!codeName || !couponType || !discountType || !discountValue) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newCoupon = await Coupon.create({
      codeName: codeName.toUpperCase(),
      couponType,
      discountType,
      discountValue,
      maxUsageLimit: maxUsageLimit || 1,
      expirationDate,
    });

    res.status(200).json({ success: true, data: newCoupon });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    res.status(500).json({ success: false, message: "Failed to create coupon" });
  }
};
// Get Coupon by codeName
export const getCouponByCodeName = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ codeName: req.params.codeName.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Update Coupon by codeName
export const updateCouponByCodeName = async (req, res) => {
  try {
    const updated = await Coupon.findOneAndUpdate(
      { codeName: req.params.codeName.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Coupon not found" });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
// Delete Coupon
export const deleteCouponByCodeName = async (req, res) => {
  try {
    const deleted = await Coupon.findOneAndDelete({ codeName: req.params.codeName.toUpperCase() });
    if (!deleted) return res.status(404).json({ success: false, message: "Coupon not found" });

    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
// Toggle Coupon Status (Active/Inactive)
export const toggleCouponStatusByCodeName = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ codeName: req.params.codeName.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: "Status toggle failed" });
  }
};
// controllers/CouponCode.js

// Get all coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }); // most recent first
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error("Fetch All Coupons Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch coupons" });
  }
};
