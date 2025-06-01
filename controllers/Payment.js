import { instance } from "../config/razorpay.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import User from "../models/UserModel.js";
import mailSender from "../utils/MailSender.js";
import mongoose from "mongoose";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";
import CourseProgress from "../models/CourseProgress.js";

// Capture payment for a single course
export async function capturePayment(req, res) {
  const { courseId } = req.body;
  const userId = req.user.id;

  if (!courseId) {
    return res.json({ success: false, message: "Please provide a Course ID" });
  }

  try {
    // Find the course by its ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if the user is already enrolled in the course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnroled.includes(uid)) {
      return res.status(200).json({ success: false, message: "Student is already enrolled" });
    }

    // Define Razorpay options
    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    };

    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      data: paymentResponse,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not initiate order." });
  }
}

// Verify payment for a single course
export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !userId) {
    return res.status(400).json({ success: false, message: "Invalid payment details" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudent(courseId, userId);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(400).json({ success: false, message: "Payment verification failed" });
}

const enrollStudent = async (courseId, userId) => {
  try {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnroled: userId } },
      { new: true }
    );

    if (!course) {
      throw new Error("Course not found");
    }

    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });

    const student = await User.findByIdAndUpdate(
      userId,
      {
        $push: { courses: courseId, courseProgress: courseProgress._id },
      },
      { new: true }
    );

    await mailSender(
      student.email,
      `Successfully Enrolled in ${course.courseName}`,
      courseEnrollmentEmail(course.courseName, `${student.firstName} ${student.lastName}`)
    );

  } catch (error) {
    console.error("Enrollment error:", error);
    throw new Error("Enrollment failed");
  }
};

// Enroll the student in a single course=
export async function manualEnrollStudent(req, res) {
  try {
    const { courseId, email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { studentsEnroled: user._id } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: user._id,
      completedVideos: [],
    });

    const student = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { courses: courseId },
        $push: { courseProgress: courseProgress._id }
      },
      { new: true }
    );

    await mailSender(
      user.email,
      `Successfully Manually Enrolled in ${course.courseName}`,
      courseEnrollmentEmail(course.courseName, `${user.firstName} ${user.lastName}`)
    );

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      data: student
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    return res.status(500).json({ success: false, message: "Enrollment failed" });
  }
}

// Send Payment Success Email
export async function sendPaymentSuccessEmail(req, res) {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please provide all the details" });
  }

  try {
    const student = await User.findById(userId);
    await mailSender(
      student.email,
      `Payment Received`,
      paymentSuccessEmail(`${student.firstName} ${student.lastName}`, amount / 100, orderId, paymentId)
    );
    res.json({ success: true, message: "Payment success email sent" });
  } catch (error) {
    console.error("Error in sending email:", error);
    res.status(400).json({ success: false, message: "Could not send email" });
  }
}
