import express from 'express';

import ActivityLog  from'../models/ActivityLog.js'; 
const router = express.Router();

// Track a new activity
router.post('/', async (req, res) => {
  try {
    const { userId, action, details } = req.body;
    
    const newActivity = new ActivityLog({
      user: userId,
      action, // "login", "upload", "status_change", etc.
      details, // "User logged in", "User uploaded a file", etc.
      timestamp: new Date()
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ error: "Failed to log activity" });
  }
});

// Get all activities (for admin panel)
router.get('/', async (req, res) => {
  try {
    const activities = await ActivityLog.find()
      .sort({ timestamp: -1 }) // Newest first
      .limit(50) // Last 50 activities
      .populate('user', 'username email'); // Include user details

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

export default router;
