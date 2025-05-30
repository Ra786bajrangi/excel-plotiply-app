import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['login', 'upload', 'download', 'view'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed // Optional: store metadata
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const UsageLog = mongoose.model('UsageLog', usageLogSchema);
export default UsageLog;
