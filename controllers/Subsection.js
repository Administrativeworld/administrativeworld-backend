// Import necessary modules
import Section from "../models/Section.js";

import SubSection from "../models/Subsection.js";
import uploadImageToCloudinary from "../utils/ImageUpload.js";

// Create a new sub-section for a given section
export async function createSubSection(req, res) {
  try {
    const { sectionId, title, description, videoUrl, timeDuration } = req.body;
    let videoDetails = { secure_url: null, duration: null };
    let videoType = "";

    // Check if required fields are provided
    if (!sectionId || !title || !description || (!req.files?.video && !videoUrl)) {
      return res.status(400).json({ success: false, message: "All Fields are Required" });
    }

    // If user uploads a video file
    if (req.files && req.files.video) {
      const video = req.files.video;
      videoDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      videoType = "Uploaded";
    }
    // If user provides a YouTube embedded link
    else if (videoUrl.startsWith("https://www.youtube.com/embed/")) {
      videoDetails.secure_url = videoUrl;
      videoDetails.duration = timeDuration || "N/A"; // Use provided time duration or set as "N/A"
      videoType = "YouTube";
    } else {
      return res.status(400).json({ success: false, message: "Invalid YouTube embedded link" });
    }

    // Create SubSection
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: videoDetails.duration || "N/A",
      description,
      videoUrl: videoDetails.secure_url,
      videoType,
    });

    // Add sub-section to section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({ success: true, data: updatedSection, message: "Sub-section created successfully" });
  } catch (error) {
    console.error("Error creating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function updateSubSection(req, res) {
  try {
    const { sectionId, subSectionId, title, description, videoUrl, timeDuration } = req.body;
    const subSection = await SubSection.findById(subSectionId);
    let videoType = subSection.videoType; // Preserve existing type

    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    // Handle video update
    if (req.files && req.files.video) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
      videoType = "Uploaded";
    } else if (videoUrl && videoUrl.startsWith("https://www.youtube.com/embed/")) {
      subSection.videoUrl = videoUrl;
      subSection.timeDuration = timeDuration || "N/A"; // Update duration if provided
      videoType = "YouTube";
    }

    subSection.videoType = videoType;
    await subSection.save();

    // Return updated section
    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.json({ success: true, message: "Sub-section updated successfully", data: updatedSection });
  } catch (error) {
    console.error("Error updating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
}

export async function deleteSubSection(req, res) {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}