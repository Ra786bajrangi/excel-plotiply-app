// models/fileModel.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: String,
  recordCount: Number,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: { type: Date, default: Date.now },
  createdAt: { type: Date }  
 }, { timestamps: true });

const File = mongoose.model('File', fileSchema);
export default File;
