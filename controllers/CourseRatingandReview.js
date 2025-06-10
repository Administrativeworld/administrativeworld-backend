import RatingAndReview from "../models/RatingAndReview.js";
import Course from "../models/Course.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

export async function createRating(req, res) {
  try {
    const userId = req.user.id
    const { rating, review, courseId } = req.body

    // Check if the user is enrolled in the course by looking at user's courses array
    const user = await User.findById(userId).select('courses')

    if (!user || !user.courses.includes(courseId)) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      })
    }

    // Verify the course exists
    const courseExists = await Course.findById(courseId)
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    })

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by user",
      })
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    })

    // Calculate the new average rating for the course
    const averageRatingResult = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ])

    const averageRating = averageRatingResult.length > 0 ? averageRatingResult[0].averageRating : 0
    const totalRatings = averageRatingResult.length > 0 ? averageRatingResult[0].totalRatings : 0

    // Update the course with the new rating review and average rating
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: ratingReview._id,
      },
      $set: {
        avgRating: averageRating,
        totalRatings: totalRatings, // Optional: also track total number of ratings
      },
    })

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
      averageRating,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get the average rating for a course
export async function getAverageRating(req, res) {
  try {
    const courseId = req.body.courseId

    // First try to get the average rating from the course document
    const course = await Course.findById(courseId).select('avgRating')

    if (course && course.avgRating !== undefined) {
      return res.status(200).json({
        success: true,
        averageRating: course.avgRating,
      })
    }

    // Fallback: Calculate the average rating using the MongoDB aggregation pipeline
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    const averageRating = result.length > 0 ? result[0].averageRating : 0

    // Update the course with the calculated average rating
    await Course.findByIdAndUpdate(courseId, {
      $set: { avgRating: averageRating }
    })

    return res.status(200).json({
      success: true,
      averageRating,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message,
    })
  }
}

// Get all rating and reviews
export async function getAllRatingReview(req, res) {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec()

    res.status(200).json({
      success: true,
      data: allReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
    })
  }
}

// Additional helper function to get ratings for a specific course
export async function getCourseRatings(req, res) {
  try {
    const { courseId } = req.params

    const courseRatings = await RatingAndReview.find({ course: courseId })
      .populate({
        path: "user",
        select: "firstName lastName image",
      })
      .sort({ createdAt: -1 })
      .exec()

    return res.status(200).json({
      success: true,
      data: courseRatings,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve course ratings",
      error: error.message,
    })
  }
}

// Helper function to recalculate average rating for a course (useful for data consistency)
export async function recalculateAverageRating(courseId) {
  try {
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ])

    const averageRating = result.length > 0 ? result[0].averageRating : 0
    const totalRatings = result.length > 0 ? result[0].totalRatings : 0

    await Course.findByIdAndUpdate(courseId, {
      $set: {
        avgRating: averageRating,
        totalRatings: totalRatings,
      },
    })

    return { averageRating, totalRatings }
  } catch (error) {
    console.error("Error recalculating average rating:", error)
    throw error
  }
}