import Section from "../models/Section.js";
import Course from "../models/Course.js";
import SubSection from "../models/Subsection.js";

// CREATE a new section
export async function createSection(req, res) {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName })

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()


    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse, newSection
    })
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// UPDATE a section
export async function updateSection(req, res) {
  try {
    const { sectionName, sectionId, courseId } = req.body

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    )
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
    res.status(200).json({
      success: true,
      message: section,
      data: course,
    })
  } catch (error) {
    console.error("Error updating section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// DELETE a section
export async function deleteSection(req, res) {
  try {
    const { sectionId, courseId } = req.body
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })
    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }
    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } })

    await Section.findByIdAndDelete(sectionId)

    // find the updated course and return it
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const fetchSections = async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log('fetchSections called -->')
    console.log(req.body)

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Nested population: courseContent -> subSection
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection"
      }
    });
    console.log("section", course)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const sections = course.courseContent.map((section, index) => ({
      value: `item-${index + 1}`,
      sectionName: section.sectionName,
      subSection: section.subSection, // Now this will be populated
      _id: section._id
    }));

    return res.status(200).json({
      success: true,
      message: "Sections fetched successfully",
      data: sections
    });

  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

