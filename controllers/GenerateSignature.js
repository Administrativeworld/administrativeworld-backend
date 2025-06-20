import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export async function generateSignature(req, res) {
  console.log("generateSignature called -->>");

  try {
    const timestamp = Math.floor(Date.now() / 1000); // current Unix timestamp
    const { uploadPreset } = req.body;

    if (!uploadPreset) {
      return res.status(409).json({ error: "Please provide uploadPreset" });
    }

    const paramsToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    return res.status(200).json({
      timestamp,
      signature,
    });

  } catch (error) {
    console.error("Signature generation error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Failed to generate Cloudinary signature",
      });
    }
  }
}
// controllers/cloudinary/generateSignatureOverwrite.js

export const generateSignatureOverwrite = (req, res) => {
  try {
    const { uploadPreset, publicId, resourceType = 'image', overwrite = true } = req.body;

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      overwrite,
      public_id: publicId,
      timestamp,
      upload_preset: uploadPreset,
    };

    // Convert to query string
    const paramString = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&');

    const signature = crypto
      .createHash('sha1')
      .update(paramString + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    return res.status(200).json({ signature, timestamp });
  } catch (error) {
    return res.status(500).json({ message: "Signature generation failed", error: error.message });
  }
};
