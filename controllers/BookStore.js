import Store from "../models/Store.js";


export async function createProduct(req,res){
    try {
        const {title,description,type,author,price,isFree,thumbnailUrl,downloadUrl,status,} = req.body;
        if(!title ||  !description || !type || !thumbnailUrl || !downloadUrl){
            return res.status(400).json({ success: false, message: "Missing required fields" });
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
          status: status || "Draft",
        });
      
        res.status(201).json({ success: true, data: newBook });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// GET ALL BOOKS
export const getAllBooks = async (req, res) => {
  try {
    const books = await Store.find()
      .populate("ratingAndReviews")
      .populate("studentsPurchase", "name email");

    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: updatedBook });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
