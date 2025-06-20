import { instance } from "../config/razorpay.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import User from "../models/UserModel.js";
import Coupon from "../models/CouponCode.js";
import mailSender from "../utils/MailSender.js";
import mongoose from "mongoose";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";
import CourseProgress from "../models/CourseProgress.js";


// Capture payment for a single course
export const capturePayment = async (req, res) => {
  const { courseId, couponCode } = req.body;
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "Course ID is required"
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

    // Get user to check if already enrolled
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if already enrolled - check user's courses array
    if (user.courses && user.courses.includes(courseId)) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course"
      });
    }

    let finalPrice = course.price;
    if (couponCode) {
      const coupon = await Coupon.findOne({ codeName: couponCode.toUpperCase() });

      if (!coupon || !coupon.isActive) {
        return res.status(400).json({ success: false, message: "Invalid or inactive coupon code" });
      }

      if (coupon.expirationDate && new Date() > coupon.expirationDate) {
        return res.status(400).json({ success: false, message: "Coupon code expired" });
      }

      if (coupon.usedByUsers.includes(userId)) {
        return res.status(400).json({ success: false, message: "Coupon already used by this user" });
      }

      if (coupon.whiteListedUsers.length > 0 && !coupon.whiteListedUsers.includes(userId)) {
        return res.status(403).json({ success: false, message: "You are not allowed to use this coupon" });
      }

      if (coupon.discountType === "PercentOff") {
        finalPrice = finalPrice - (finalPrice * (coupon.discountValue / 100));
      } else if (coupon.discountType === "RupeesOff") {
        finalPrice = finalPrice - coupon.discountValue;
      }

      if (finalPrice < 0) finalPrice = 0;
    }

    console.log("final price:", finalPrice);

    const options = {
      amount: Math.round(finalPrice * 100),
      currency: "INR",
      receipt: `${courseId.slice(0, 10)}_${Date.now()}`,
      notes: {
        courseId,
        userId,
        couponCode: couponCode || "NONE"
      }
    };

    const paymentResponse = await instance.orders.create(options);


    

    return res.status(200).json({
      success: true,
      data: paymentResponse
    });
  } catch (error) {
    console.error("Payment capture error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed"
    });
  }
};


// Verify payment and enroll student
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
  const userId = req.user.id;

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid signature"
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get course details (without updating it)
    const course = await Course.findById(courseId).session(session);

    if (!course) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Create course progress
    const courseProgress = await CourseProgress.create([{
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    }], { session });

    // Update user with course and progress (only updating user document)
    const student = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { courses: courseId },
        $push: { courseProgress: courseProgress[0]._id },
      },
      { new: true, session }
    );

    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    course.purchases = (course.purchases || 0) + 1;
    await course.save()
    await session.commitTransaction();
    await Coupon.findOneAndUpdate(
      { codeName: couponCode },
      { $addToSet: { usedByUsers: userId } }
    );
    // Send enrollment and payment success emails
    try {
      await Promise.all([
        mailSender(
          student.email,
          `Successfully Enrolled in ${course.courseName}`,
          courseEnrollmentEmail(course.courseName, `${student.firstName} ${student.lastName}`)
        ),
        mailSender(
          student.email,
          "Payment Confirmation",
          paymentSuccessEmail(
            `${student.firstName} ${student.lastName}`,
            course.price,
            razorpay_order_id,
            razorpay_payment_id
          )
        )
      ]);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the entire transaction for email errors
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and student enrolled successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete enrollment"
    });
  } finally {
    session.endSession();
  }
};



// Manual enrollment (for admin use)

// ✅ Helper function to enroll a student
async function enrollStudent(courseId, userId) {
  // Add course to user's enrolled courses
  await User.findByIdAndUpdate(userId, {
    $addToSet: { courses: courseId },
  });

  // Add user to course's enrolled students
  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { studentsEnroled: userId },
    $inc: { purchases: 1 }, // Optional: increment purchases count
  });

  // Create course progress document
  const courseProgress = await CourseProgress.create({
    courseID: courseId,
    userId: userId,
    completedVideos: [],
  });

  // Attach progress to user
  await User.findByIdAndUpdate(userId, {
    $push: { courseProgress: courseProgress._id },
  });

  return true;
}

// ✅ Controller for manual enrollment
export async function manualEnrollStudent(req, res) {
  try {
    const { courseId, email } = req.body;

    if (!courseId || !email) {
      return res.status(400).json({
        success: false,
        message: "Course ID and email are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    if (Array.isArray(course.studentsEnroled) && course.studentsEnroled.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    // ✅ Enroll the student using helper
    await enrollStudent(courseId, user._id);

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.error("Manual enrollment error:", error);
    return res.status(500).json({
      success: false,
      message: "Manual enrollment failed",
    });
  }
}
