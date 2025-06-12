import Store from "../models/Store.js";
import User from "../models/UserModel.js";
import { cloudinary } from "../config/cloudinary.js";
import { getTokenData } from "../config/bookTokenStore.js";
import fetch from 'node-fetch'; // or axios if you prefer

// CREATE A NEW BOOK
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      author,
      price,
      isFree = false,
      thumbnailUrl,
      downloadUrl,
      status = "Draft",
      thumbnail_public_id,
      pdf_public_id,
      thumbnail_format,
      pdf_format,
      thumbnail_bytes,
      pdf_bytes,
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !thumbnailUrl || !downloadUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, type, thumbnailUrl, downloadUrl",
      });
    }

    const newBook = await Store.create({
      title,
      description,
      type,
      author,
      price,
      isFree,
      thumbnailUrl,
      downloadUrl,
      status,
      thumbnail_public_id,
      pdf_public_id,
      thumbnail_format,
      pdf_format,
      thumbnail_bytes,
      pdf_bytes,
    });

    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
      error: error.message,
    });
  }
};

// GET ALL BOOKS
export const getAllBooks = async (req, res) => {
  try {
    const {
      page,
      limit,
      sort = "createdAt",
      order = "desc",
      category,
      author,
      search,
    } = req.query;

    const filter = {};
    if (category) filter.type = category;
    if (author) filter.author = author;
    if (search) filter.title = { $regex: search, $options: "i" };

    const pageNumber = parseInt(page) || 0;
    const limitNumber = parseInt(limit) || 0;
    const skip = (pageNumber - 1) * limitNumber;

    let query = Store.find(filter)
      .populate("ratingAndReviews")
      .sort({ [sort]: order === "asc" ? 1 : -1 });

    if (pageNumber && limitNumber) {
      query = query.skip(skip).limit(limitNumber);
    }

    const [books, total] = await Promise.all([
      query.exec(),
      Store.countDocuments(filter),
    ]);

    const totalPages = limitNumber ? Math.ceil(total / limitNumber) : 1;

    // Sanitize the book fields (remove sensitive information)
    const sanitizedBooks = books.map((book) => {
      const {
        thumbnail_public_id,
        thumbnail_bytes,
        downloadUrl,
        pdf_format,
        pdf_bytes,
        pdf_public_id,
        ...allowedFields
      } = book.toObject();
      return allowedFields;
    });

    res.status(200).json({
      success: true,
      data: sanitizedBooks,
      meta: {
        totalItems: total,
        currentPage: pageNumber || null,
        totalPages: pageNumber ? totalPages : null,
        hasNextPage: pageNumber ? pageNumber < totalPages : false,
        hasPrevPage: pageNumber ? pageNumber > 1 : false,
        limit: limitNumber || null,
      },
    });
  } catch (error) {
    console.error("Get All Books Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching books",
      error: error.message,
    });
  }
};

// GET SINGLE BOOK
export const getBookById = async (req, res) => {
  console.log("getBookById called ->>");

  try {
    const book = await Store.findById(req.body.id)
      .populate("ratingAndReviews");

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Remove sensitive fields from response
    const {
      thumbnail_public_id,
      thumbnail_bytes,
      downloadUrl,
      pdf_format,
      pdf_bytes,
      pdf_public_id,
      ...filteredBook
    } = book.toObject();

    res.status(200).json({
      success: true,
      data: filteredBook,
    });
  } catch (error) {
    console.error("Get Book By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("Update Book Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assuming this is your Store model

export const createBooksCombo = async (req, res) => {
  try {
    const {
      comboTitle,
      comboDescription,
      includedMaterials,
      comboPrice,
      finalPrice,
      isFree,
      thumbnailUrl,
      thumbnail_public_id,
      thumbnail_format,
      status
    } = req.body.updatedFormData;

    // Validate includedMaterials is a non-empty array
    if (!Array.isArray(includedMaterials) || includedMaterials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one material must be included in the combo."
      });
    }

    // Check if all includedMaterials are valid ObjectIds
    for (let id of includedMaterials) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ObjectId: ${id}`
        });
      }
    }

    // Check if all ObjectIds exist in Store
    const foundMaterials = await Store.find({ _id: { $in: includedMaterials } });
    if (foundMaterials.length !== includedMaterials.length) {
      return res.status(404).json({
        success: false,
        message: "Some included materials were not found in the store."
      });
    }

    // Create the combo
    const newCombo = await BookStoreCombo.create({
      comboTitle,
      comboDescription,
      includedMaterials,
      comboPrice,
      finalPrice,
      isFree,
      thumbnailUrl,
      thumbnail_public_id,
      thumbnail_format,
      status
    });

    // Add the new combo ID to each Store item's combo field
    await Store.updateMany(
      { _id: { $in: includedMaterials } },
      { $addToSet: { combo: newCombo._id } } // Prevents duplicate combo IDs
    );

    return res.status(201).json({
      success: true,
      message: "Combo created successfully",
      data: newCombo
    });

  } catch (error) {
    console.error("Error creating combo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getBookCombos = async (req, res) => {
  try {
    const combos = await BookStoreCombo.find()
      .populate({
        path: "includedMaterials",
        model: "Store" // Replace with your actual model name if different
      })
      .sort({ createdAt: -1 }); // Optional: to get latest combos first

    if (!combos || combos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No combos found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Combos fetched successfully",
      data: combos
    });

  } catch (error) {
    console.error("Error fetching combos:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const book = await Store.findById(req.body.id);
    console.log(req.body);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // TODO: Optionally delete Cloudinary files using public_id here
    // if (book.thumbnail_public_id) {
    //   await cloudinary.uploader.destroy(book.thumbnail_public_id);
    // }
    // if (book.pdf_public_id) {
    //   await cloudinary.uploader.destroy(book.pdf_public_id, { resource_type: "raw" });
    // }

    await book.deleteOne();

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete Book Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MATERIAL FILE - Updated to check user's materials array
import { createToken } from "../config/bookTokenStore.js";

export const generateStoreDownloadToken = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id.toString();

    if (!bookId) return res.status(400).json({ message: 'bookId is required' });

    const book = await Store.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Material not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hasAccess = user.materials.map(id => id.toString()).includes(bookId) || book.isFree;
    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    const token = createToken({
      bookId,
      userId,
      cloudUrl: book.downloadUrl, // private Cloudinary URL
      filename: book.title.replace(/\s+/g, '_') + '.pdf'
    });

    return res.status(200).json({
      message: 'Secure download token generated',
      downloadUrl: `/download/${token}`,
    });
  } catch (error) {
    console.error('[Generate Token Error]', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const downloadWithToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Validate and get token data
    const tokenData = getTokenData(token);
    if (!tokenData) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { cloudUrl, filename, bookId, userId } = tokenData;

    try {
      // Fetch the file from Cloudinary
      const response = await fetch(cloudUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      // Set appropriate headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Stream the file to the client
      response.body.pipe(res);

    } catch (fetchError) {
      console.error('[File Fetch Error]', fetchError);
      return res.status(500).json({
        message: 'Failed to retrieve file',
        error: fetchError.message
      });
    }

  } catch (error) {
    console.error('[Download Error]', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Alternative implementation using axios (if you prefer)

import axios from 'axios';
import BookStoreCombo from "../models/BookStoreCombo.js";
import mongoose from "mongoose";

export const downloadWithTokenAxios = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const tokenData = getTokenData(token);
    if (!tokenData) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { cloudUrl, filename } = tokenData;

    // Fetch file from Cloudinary
    const response = await axios({
      method: 'GET',
      url: cloudUrl,
      responseType: 'stream'
    });

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Pipe the stream
    response.data.pipe(res);

  } catch (error) {
    console.error('[Download Error]', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};



// // NEW: Get user's purchased materials
// export const getUserMaterials = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const user = await User.findById(userId).populate({
//       path: 'materials',
//       select: 'title description type author price thumbnailUrl createdAt'
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user.materials,
//       message: 'User materials retrieved successfully'
//     });
//   } catch (error) {
//     console.error('Get User Materials Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching user materials',
//       error: error.message,
//     });
//   }
// };