import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import File from '../models/fileModel.js'; 

const router = express.Router();

router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('uploadedFiles');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure we only send one response
    return res.json({
      success: true,
      uploadedFiles: user.uploadedFiles || []
    });

  } catch (err) {
    console.error('Error in /history:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});






export default router;






