
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
