import { instance } from "../config/razorpay.js";
import crypto from "crypto";
import Store from "../models/Store.js";
import User from "../models/UserModel.js";
import mailSender from "../utils/MailSender.js";

export const captureBookPayment = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  if (!bookId) return res.status(400).json({ success: false, message: "Book ID is required" });

  try {
    const book = await Store.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    // Check if already purchased
    if (book.studentsPurchase.includes(userId)) {
      return res.status(409).json({ success: false, message: "Already purchased" });
    }

    const options = {
      amount: book.price * 100,
      currency: "INR",
      receipt: `book_${Math.random().toString(36).slice(2)}`,
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({ success: true, data: paymentResponse });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

export const verifyBookPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookId } = req.body;
  const userId = req.user.id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const updatedBook = await Store.findByIdAndUpdate(
      bookId,
      {
        $push: { studentsPurchase: userId },
        $inc: { purchases: 1 },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      $push: { materials: bookId },
    });

    const user = await User.findById(userId);
    await mailSender(
      user.email,
      "Purchase Confirmed",
      `You have successfully purchased ${updatedBook.title}`
    );

    res.status(200).json({ success: true, message: "Payment verified and book purchased" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to complete purchase" });
  }
};
