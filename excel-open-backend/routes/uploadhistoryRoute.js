import express from 'express';
import User from '../models/User.js'
import File from '../models/fileModel.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('uploadedFiles');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get complete file documents with dates
    const files = await File.find({
      _id: { $in: user.uploadedFiles }
    })
    .select('filename uploadDate createdAt')
    .sort({ uploadDate: -1 })
    .lean();

    // Format dates for frontend
    const formattedFiles = files.map(file => ({
      ...file,
      _id: file._id.toString(), // Ensure ID is string
      uploadDate: file.uploadDate?.toISOString() || new Date().toISOString(),
      createdAt: file.createdAt?.toISOString() || new Date().toISOString()
    }));

    return res.json({
      success: true,
      uploadedFiles: formattedFiles
    });

  } catch (err) {
    console.error('Error in /history:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});

export default router