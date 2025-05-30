import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import usagelogs from '../models/UsageLog.js';
import File from '../models/fileModel.js';
const router = express.Router();



router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'usagelogs',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $eq: ['$action', 'upload'] }
                  ]
                }
              }
            },
            { $count: 'uploadCount' }
          ],
          as: 'uploads'
        }
      },
      {
        $addFields: {
          uploadCount: { $ifNull: [{ $arrayElemAt: ['$uploads.uploadCount', 0] }, 0] }
        }
      },
      {
        $project: {
          password: 0,
          uploads: 0
        }
      }
    ]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users with usage logs' });
  }
});

// @desc    Get dashboard analytics
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    const totalUploads = await File.countDocuments();
    

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalUploads,
      
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// PUT update user role
router.put('/users/:id/role', protect, admin, async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// PUT toggle user active status
router.put('/users/:id/status', protect, admin, async (req, res) => {
  const { isActive } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = isActive;
    await user.save();

    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// DELETE user
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
