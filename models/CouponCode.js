import mongoose from 'mongoose';
 
const CouponSchema = new mongoose.Schema({
  codeName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
 
  couponType: {
    type: String,
    enum: ['Material', 'Universal'],
    required: true
  },
 
  usedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
 
  whiteListedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
 
  discountType: {
    type: String,
    enum: ['PercentOff', 'RupeesOff'],
    required: true
  },
 
  discountValue: {
    type: Number,
    required: true,
    min: 1
  },
 
  maxUsageLimit: {
    type: Number,
    default: 1,
    min: 1
  },
 
  expirationDate: {
    type: Date,
  },
 
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
 
export default mongoose.model('Coupon', CouponSchema);
 