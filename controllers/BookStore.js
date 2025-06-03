import Store from "../models/Store.js";

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
      .populate("studentsPurchase", "name email")
      .sort({ [sort]: order === "asc" ? 1 : -1 });

    if (pageNumber && limitNumber) {
      query = query.skip(skip).limit(limitNumber);
    }

    const [books, total] = await Promise.all([
      query.exec(),
      Store.countDocuments(filter),
    ]);

    const totalPages = limitNumber ? Math.ceil(total / limitNumber) : 1;

    res.status(200).json({
      success: true,
      data: books,
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
  try {
    const book = await Store.findById(req.params.id)
      .populate("ratingAndReviews")
      .populate("studentsPurchase", "name email");

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
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

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const book = await Store.findById(req.body.id);
    console.log(req.body)
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // TODO: Optionally delete Cloudinary files using public_id here

    await book.deleteOne();

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete Book Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
