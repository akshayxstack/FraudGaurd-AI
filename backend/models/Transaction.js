import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: [true, 'Case reference is required'],
      index: true,
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    description: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    merchant: {
      type: String,
      default: '',
    },
    customerName: {
      type: String,
      default: '',
    },
    predictionProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    isFraud: {
      type: Boolean,
      default: false,
    },
    topFeatures: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    explanation: {
      type: String,
      default: '',
    },
    geminiExplanation: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['flagged', 'reviewed', 'resolved'],
      default: 'flagged',
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes
transactionSchema.index({ date: -1 });
transactionSchema.index({ isFraud: 1 });
transactionSchema.index({ riskLevel: 1 });
transactionSchema.index({ case: 1, isFraud: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
