import SubSection from "../models/Subsection.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/Course.js"; // Assuming you have a Course model

export async function updateCourseProgress(req, res) {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!courseId || !subsectionId) {
    return res.status(400).json({
      error: "Course ID and Subsection ID are required"
    });
  }

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({
        error: "Invalid subsection"
      });
    }

    // Verify that the subsection belongs to the course
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection"
      }
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    // Check if subsection belongs to this course
    const subsectionBelongsToCourse = course.courseContent.some(section =>
      section.subSection.some(sub => sub._id.toString() === subsectionId)
    );

    if (!subsectionBelongsToCourse) {
      return res.status(400).json({
        error: "Subsection does not belong to this course"
      });
    }

    // Find or create course progress document
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // Create new course progress if it doesn't exist
      courseProgress = new CourseProgress({
        courseID: courseId,
        userId: userId,
        completedVideos: [subsectionId]
      });
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({
          error: "Subsection already completed"
        });
      }

      // Add the subsection to completedVideos array
      courseProgress.completedVideos.push(subsectionId);
    }

    // Save the course progress
    await courseProgress.save();

    // Calculate new progress percentage
    let totalLectures = 0;
    course.courseContent.forEach((section) => {
      totalLectures += section.subSection?.length || 0;
    });

    const progressPercentage = totalLectures > 0
      ? Math.round((courseProgress.completedVideos.length / totalLectures) * 100 * 100) / 100
      : 0;

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: {
        completedVideos: courseProgress.completedVideos.length,
        totalVideos: totalLectures,
        progressPercentage: progressPercentage
      }
    });

  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
}

export async function getProgressPercentage(req, res) {
  const { courseId } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!courseId) {
    return res.status(400).json({
      error: "Course ID is required"
    });
  }

  if (!userId) {
    return res.status(401).json({
      error: "User not authenticated"
    });
  }

  try {
    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    }).populate({
      path: "courseID",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSection"
        }
      },
    });

    if (!courseProgress) {
      // If no progress exists, return 0% progress
      return res.status(200).json({
        success: true,
        data: 0,
        message: "No progress found for this course",
        details: {
          completedVideos: 0,
          totalVideos: 0
        }
      });
    }

    if (!courseProgress.courseID || !courseProgress.courseID.courseContent) {
      return res.status(404).json({
        error: "Course content not found"
      });
    }

    // Calculate total lectures
    let totalLectures = 0;
    courseProgress.courseID.courseContent.forEach((section) => {
      totalLectures += section.subSection?.length || 0;
    });

    // Calculate progress percentage
    const completedCount = courseProgress.completedVideos?.length || 0;
    let progressPercentage = totalLectures > 0
      ? (completedCount / totalLectures) * 100
      : 0;

    // Round to 2 decimal places
    progressPercentage = Math.round(progressPercentage * 100) / 100;

    return res.status(200).json({
      success: true,
      data: progressPercentage,
      message: "Successfully fetched course progress",
      details: {
        completedVideos: completedCount,
        totalVideos: totalLectures,
        courseId: courseId,
        userId: userId
      }
    });

  } catch (error) {
    console.error("Error fetching progress percentage:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
}