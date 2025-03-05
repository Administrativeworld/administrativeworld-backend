import Profile from "../models/Profile.js";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/Course.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
// Method for updating a profile
const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return null;

  const parts = dateString.split(".");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`); // Convert to YYYY-MM-DD format
  }

  return null;
};

export async function updateProfile(req, res) {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({ user: userId });
      await profile.save();
      user.additionalDetails = profile._id;
      await user.save();
    }

    const userUpdates = {};
    const profileUpdates = {};

    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;

    if (gender) profileUpdates.gender = gender;
    if (about) profileUpdates.about = about;
    if (contactNumber) profileUpdates.contactNumber = contactNumber;

    // Save the dateOfBirth as a string in DD.MM.YYYY format
    if (dateOfBirth) {
      const regex = /^\d{2}\.\d{2}\.\d{4}$/; // Validate the date format
      if (regex.test(dateOfBirth)) {
        profileUpdates.dateOfBirth = dateOfBirth; // Store as string
      } else {
        return res.status(400).json({ success: false, message: "Invalid date format. Use DD.MM.YYYY" });
      }
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates, { new: true });
    }
    if (Object.keys(profileUpdates).length > 0) {
      await Profile.findByIdAndUpdate(profile._id, profileUpdates, { new: true });
    }

    const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();

    return res.json({ success: true, message: "Profile updated successfully", updatedUserDetails });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteAccount(req, res) {
  try {
    const id = req.user.id
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

export async function getAllUserDetails(req, res) {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function updateDisplayPicture(req, res) {
  try {
    const { imageUrl } = req.body; // Expecting the URL from frontend
    const userId = req.user.id;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const updatedProfile = await User.findByIdAndUpdate(
      userId, // No need to use `{ _id: userId }`
      { image: imageUrl },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getEnrolledCourses(req, res) {
  try {
    const user = req.user;

    if (!user || !user._id) {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }

    // Convert user._id to ObjectId safely
    const userId = mongoose.Types.ObjectId.isValid(user._id)
      ? new mongoose.Types.ObjectId(user._id)
      : user._id;

    // Query to find courses where studentsEnrolled array contains user._id
    const courses = await Course.find({ studentsEnroled: userId })
      .populate([
        {
          path: "courseContent",
          select: "_id", // Select other fields if needed
        },
        {
          path: "category",
          select: "name", // Ensure this populates the category name
        },
      ])
      .select("_id courseDescription courseName category thumbnail ");

    // Refine response
    const refinedCourses = courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName || "Untitled Course",
      courseDescription: course.courseDescription || "No Description",
      category: course.category?.name || "Uncategorized", // ✅ Now correctly populated
      price: "Enrolled",
      thumbnail: course.thumbnail || "",
    }));

    res.status(200).json({
      success: true,
      courses: refinedCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    // res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
}

export async function adminDashboard(req, res) {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
