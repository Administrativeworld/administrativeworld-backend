import { instance } from "../config/razorpay.js";
import crypto from "crypto";
import Store from "../models/Store.js";
import User from "../models/UserModel.js";
import mailSender from "../utils/MailSender.js";
import BookStoreCombo from "../models/BookStoreCombo.js";

export const captureBookPayment = async (req, res) => {
  const { bookId, comboId } = req.body;
  const userId = req.user.id;

  console.log(req.body)
  if (!bookId && !comboId) {
    return res.status(400).json({ success: false, message: "Book ID or Combo ID is required" });
  }

  if (bookId && comboId) {
    return res.status(400).json({ success: false, message: "Only one of Book ID or Combo ID should be provided at a time" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let item = null;
    let itemType = "";
    let price = 0;

    if (bookId) {
      item = await Store.findById(bookId);
      itemType = "Book";

      if (!item) return res.status(404).json({ success: false, message: "Book not found" });

      // Check if book is already purchased
      if (user.materials && user.materials.includes(bookId)) {
        return res.status(409).json({ success: false, message: "Book already purchased" });
      }

      price = item.price;
    }

    if (comboId) {
      item = await BookStoreCombo.findById(comboId);
      itemType = "Combo";

      if (!item) return res.status(404).json({ success: false, message: "Combo not found" });

      // Check if combo is already purchased
      if (user.materials && user.materials.includes(comboId)) {
        return res.status(409).json({ success: false, message: "Combo already purchased" });
      }

      price = item.finalPrice;
    }

    const options = {
      amount: price * 100, // Amount in paise
      currency: "INR",
      receipt: `${itemType}_${Math.random().toString(36).slice(2)}`,
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({ success: true, data: paymentResponse });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

export const verifyBookPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookId, comboId } = req.body;
  const userId = req.user.id;

  // Validate IDs
  if (!bookId && !comboId) {
    return res.status(400).json({ success: false, message: "Book ID or Combo ID is required" });
  }

  if (bookId && comboId) {
    return res.status(400).json({ success: false, message: "Only one of Book ID or Combo ID should be provided at a time" });
  }

  // Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let purchasedItems = [];
    let itemName = "";

    if (bookId) {
      const book = await Store.findById(bookId);
      if (!book) return res.status(404).json({ success: false, message: "Book not found" });

      purchasedItems.push(bookId);
      itemName = book.title;

    } else if (comboId) {
      const combo = await BookStoreCombo.findById(comboId);
      if (!combo) return res.status(404).json({ success: false, message: "Combo not found" });

      // Add all materials from the combo to the user's purchased list
      purchasedItems = combo.includedMaterials;
      itemName = combo.comboTitle;
    }

    // Update user's materials array with purchased items (prevent duplicates)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { materials: { $each: purchasedItems } } }, // Smart way to add multiple without duplication
      { new: true }
    );

    // Send purchase confirmation email
    await mailSender(
      updatedUser.email,
      "Purchase Confirmed",
      `You have successfully purchased ${itemName}`
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and purchase completed successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete purchase"
    });
  }
};