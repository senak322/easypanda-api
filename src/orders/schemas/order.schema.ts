import mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  userIdentifier: { type: String, required: true },
  sendCurrency: { type: String, required: true },
  receiveCurrency: { type: String, required: true },
  sendAmount: { type: Number, required: true },
  receiveAmount: { type: Number, required: true },
  sendBank: { type: String, required: true },
  receiveBank: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerData: { type: String, required: true },
  status: {
    type: String,
    default: 'pending', // pending, waitingAccept, completed, cancelled
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 30 * 60000,
    required: true,
  },
  qrCodeFileId: String, // Опционально для QR кодов
  hash: { type: String, required: true },
});
