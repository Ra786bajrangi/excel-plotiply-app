import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import multer from 'multer';


const router = express.Router();
 
const storage = multer.memoryStorage(); // or use diskStorage if saving to disk
const upload = multer({ storage });
// ✅ GET /api/profile
router.get('/', protect, getProfile);

// ✅ PUT /api/profile
router.put('/', protect,upload.single('avatar'), updateProfile);

export default router;