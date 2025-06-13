import Course from "../models/Course.js";
import Category from "../models/Category.js";
import Section from "../models/Section.js";
import SubSection from "../models/Subsection.js";
import User from "../models/UserModel.js";
import CourseCreation from "../models/CourseCreation.js";
import CourseProgress from "../models/CourseProgress.js";
import convertSecondsToDuration from "../utils/secToDuration.js";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";

export async function createCourse(req, res) {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
      couponCode,
      thumbnail, // Now treating as a string
      thumbnail_public_id,
      thumbnail_format,
      thumbnail_resource_type,
      thumbnail_bytes
    } = req.body

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Admin",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }

    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      couponCode: couponCode || null,
      tag,
      category: categoryDetails._id,
      thumbnail, // Now storing as a string
      thumbnail_public_id,
      thumbnail_format,
      thumbnail_resource_type,
      thumbnail_bytes,
      status: status,
      instructions,
    })
    // update the state of courseCreation
    await CourseCreation.create({
      creation: true,
      courseId: newCourse._id,
      creationStep: 1,
    })
    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

export async function getCourseCreation(req, res) {
  try {
    const courseCreationDrafts = await CourseCreation.find()
      .populate({
        path: 'courseId',
        select: 'courseName courseDescription thumbnail category '
      });
    const userId = req.user._id;
    const isAdmin = await User.findOne({ _id: userId, accountType: "Admin" });
    if (!isAdmin) {
      return res.status(401).json({
        message: "Unauthorized",
        error: error.message,
      })
    }
    return res.status(200).json(courseCreationDrafts)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export async function publishCourse(req, res) {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId not provided" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course status to 'Published'
    course.status = "Published";
    await course.save();

    await CourseCreation.findOneAndDelete({ courseId: courseId })

    res.status(200).json({
      success: true,
      message: "Course published successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to publish course",
      error: error.message,
    });
  }
}
export async function deleteCourseThumbnail(req, res) {
  try {
    console.log('deleteCourseThumbnail called -->')
    const { courseId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId)

    if (!courseId || !user || course) {
      return res.status(400).json({ success: false, message: "courseId and valid user are required" });
    }
    if (!course.thumbnail_public_id || course.thumbnail_public_id === "") {
      return res.status(200).json({ success: true, message: "Image not found or could not be deleted" })
    }
    const result = await cloudinary.uploader.destroy(course.thumbnail_public_id);

    if (result.result !== "ok") {
      return res.status(400).json({ success: false, message: "Image not found or could not be deleted" });
    }

    // Correct way to clear user's image fields
    course.thumbnail = "";
    course.thumbnail_public_id = "";
    course.thumbnail_resource_type = "";
    course.thumbnail_format = "";
    course.thumbnail_bytes = "";

    await user.save();

    return res.status(200).json({ success: true, message: "Image deleted successfully", result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete image", error: error.message });
  }
}
// Edit Course Details
export async function editCourse(req, res) {
  try {
    // Ensure only Admins can update the course
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins can edit courses",
      })
    }

    const {
      courseId,
      courseName,
      whatYouWillLearn,
      price,
      couponCode,
      thumbnail,
      thumbnail_public_id,
      thumbnail_format,
      thumbnail_resource_type,
      thumbnail_bytes,
      tag: _tag,
      category,
      instructions: _instructions,
    } = req.body
    console.log("edit Course called ->>")
    console.log(req.body)
    // Validate course existence
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(480).json({
        success: false,
        message: "Course not found",
      })
    }

    // Validate category existence if provided
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        })
      }
    }

    // Convert comma-separated strings to arrays
    const tag = _tag ? _tag.split(",").map((item) => item.trim()) : []
    const instructions = _instructions ? _instructions.split(",").map((item) => item.trim()) : []

    // Update only provided fields
    const updateFields = {}
    if (courseName) updateFields.courseName = courseName
    if (whatYouWillLearn) updateFields.whatYouWillLearn = whatYouWillLearn
    if (price !== undefined) updateFields.price = price
    if (couponCode !== undefined) updateFields.couponCode = couponCode
    if (thumbnail) updateFields.thumbnail = thumbnail
    if (_tag) updateFields.tag = tag
    if (_instructions) updateFields.instructions = instructions
    if (category) updateFields.category = category
    if (thumbnail_public_id) updateFields.thumbnail_public_id = thumbnail_public_id
    if (thumbnail_format) updateFields.thumbnail_format = thumbnail_format
    if (thumbnail_bytes) updateFields.thumbnail_bytes = thumbnail_bytes
    if (thumbnail_resource_type) updateFields.thumbnail_resource_type = thumbnail_resource_type

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateFields, {
      new: true,
    }).populate("category")

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error updating course: ${error.message}`,
    })
  }
}

// Get Course List - Updated to not populate studentsEnroled
export async function getAllCourses(req, res) {
  try {
    let { page = 1, limit = 10, categoryIds } = req.body;

    // Convert to numbers and validate
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    // Build the filter
    let filter = { status: "Published" };

    // Apply category filter if provided
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      filter.category = { $in: categoryIds };
    }

    // Get total count
    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);
    if (page > totalPages) page = totalPages;

    // Fetch courses without studentsEnroled population
    const courses = await Course.find(filter)
      .select("courseName price thumbnail instructor tag ratingAndReviews courseDescription avgRating")
      .populate("instructor", "firstName lastName email") // Populate specific fields from instructor
      .populate("category", "_id name") // Only populate _id and name from category
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage: page,
      totalCourses,
      data: courses,
    });
  } catch (error) {
    console.error("Error in fetching courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Can't Fetch Course Data",
      error: error.message,
    });
  }
}

export async function getACourse(req, res) {
  try {
    const { courseId } = req.body; // Extract courseId properly

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId format" });
    }

    // Populate courseContent -> sections -> subSection (including 'title' field)
    const course = await Course.findOne({ _id: courseId, status: "Published" })
      .populate([
        {
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "title description"
          },
        },
        {
          path: "category",
          select: "name"
        }
      ]);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Error in fetching courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Can't Fetch Course Data",
      error: error.message,
    });
  }
}

export async function getCourseDetails(req, res) {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Updated getFullCourseDetails to check user's courses array instead of course's studentsEnroled
export async function getFullCourseDetails(req, res) {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    // First, check if user has access to this course
    if (req.user.accountType !== "Admin") {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const userCourseIds = user.courses.map(id => id.toString());
      const hasAccess = userCourseIds.includes(courseId);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not enrolled in this course",
        });
      }
    }

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    if (courseDetails.status === "Draft" && req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: `Accessing a draft course is forbidden`,
      });
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Updated deleteCourse function
export async function deleteCourse(req, res) {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Remove course from all users who have it in their courses array
    await User.updateMany(
      { courses: courseId },
      {
        $pull: { courses: courseId },
        $pull: { courseProgress: { $in: await CourseProgress.find({ courseID: courseId }).select('_id') } }
      }
    );

    // Delete all course progress records for this course
    await CourseProgress.deleteMany({ courseID: courseId });

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Remove course from category
    await Category.updateOne(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    // Delete any course creation records
    await CourseCreation.deleteOne({ courseId: courseId });

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// NEW: Get enrolled students for a course (for admin use)
export async function getEnrolledStudents(req, res) {
  try {
    const { courseId } = req.body;

    // Only allow admins to access this
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins can view enrolled students",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Find all users who have this course in their courses array
    const enrolledStudents = await User.find(
      { courses: courseId },
      { firstName: 1, lastName: 1, email: 1, createdAt: 1 }
    );

    // Get course details
    const course = await Course.findById(courseId, { courseName: 1 });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseName: course.courseName,
        totalEnrolled: enrolledStudents.length,
        students: enrolledStudents,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// NEW: Get user's enrolled courses
export async function getUserEnrolledCourses(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: 'courses',
      select: 'courseName courseDescription thumbnail price instructor category createdAt',
      populate: [
        {
          path: 'instructor',
          select: 'firstName lastName'
        },
        {
          path: 'category',
          select: 'name'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user.courses,
      message: 'User enrolled courses retrieved successfully'
    });
  } catch (error) {
    console.error('Get User Enrolled Courses Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses',
      error: error.message,
    });
  }
}

export async function getTopRatedCourses(req, res) {
  const { num } = req.query;

  try {
    const allCourses = await Course.find()
      .select("courseName price thumbnail instructor tag ratingAndReviews courseDescription avgRating")
      .populate("instructor", "firstName lastName email") // Populate specific fields from instructor
      .populate("category", "_id name")

    // Sort by avgRating (default to 0 if undefined)
    const sortedCourses = allCourses
      .map(course => ({
        ...course._doc,
        avgRating: course.avgRating || 0,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, Number(num) || 5); // fallback to 5 if num not provided

    return res.status(200).json({
      success: true,
      message: `Top ${num || 5} rated courses fetched successfully`,
      data: sortedCourses,
    });
  } catch (error) {
    console.error("Error fetching top-rated courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top-rated courses",
      error: error.message,
    });
  }
}
