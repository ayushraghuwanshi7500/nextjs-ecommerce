import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user'
    },
    product: [
      {
        quantity: { type: Number, default: 1 },
        product: { type: ObjectId, ref: 'product' }
      }
    ],
    email: {
      type: String,
      required: true
    },
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.order || mongoose.model('order', orderSchema);
