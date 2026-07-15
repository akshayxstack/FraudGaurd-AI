import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: [true, 'Case ID is required'],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by (User) is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Under Review', 'Closed'],
      default: 'Open',
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    amountAtRisk: {
      type: Number,
      default: 0,
    },
    transactionCount: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
    },
    recommendation: {
      type: String,
      default: '',
    },
    sourceFile: {
      type: String,
      default: '',
    },
    processingStatus: {
      type: String,
      default: 'Pending',
    },
    notes: [
      {
        text: { type: String, required: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes for Dashboard and Analytics
caseSchema.index({ status: 1 });
caseSchema.index({ riskLevel: 1 });
caseSchema.index({ createdAt: -1 });

const Case = mongoose.model('Case', caseSchema);
export default Case;
