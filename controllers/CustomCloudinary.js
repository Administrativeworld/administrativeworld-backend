
export async function deleteAsset(req, res) {
  try {
    console.log('deleteCourseThumbnail called -->')
    const { publicId, documentId, fieldName } = req.body;
    const userId = req.user.id;

    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId and valid user are required" });
    }
   
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res.status(400).json({ success: false, message: "asset not found or could not be deleted" });
    }


    return res.status(200).json({ success: true, message: " deleted successfully", result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete image", error: error.message });
  }
}