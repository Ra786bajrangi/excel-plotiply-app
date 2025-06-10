import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import File from '../models/fileModel.js';
import UsageLog from '../models/UsageLog.js'; 
import ActivityLog from '../models/ActivityLog.js'; // 👈 add at the top if not present

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only Excel files are allowed.'));
  }
});

// ✅ Upload endpoint
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Save file to File collection
    const newFile = new File({
      filename: req.file.filename,
      path: req.file.path,
      recordCount: sheetData.length,
      uploadedBy: user._id,
    });
    await newFile.save();

    // Link file to user
    user.uploadedFiles.push(newFile._id);
    await user.save();
 
    await ActivityLog.create({
  user: user._id,
  action: 'upload',
  details: `${user.username} uploaded file "${req.file.originalname}" with ${sheetData.length} records.`,
});
console.log('📦 Upload activity logged');
    res.json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});
// DELETE: Delete a file by its ID
router.delete('/:fileId', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Check if the logged-in user is the owner
    if (file.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this file.' });
    }

    // Delete the physical file from the filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Remove reference from the user's uploadedFiles list
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { uploadedFiles: file._id }
    });

    // Delete the file document from the File collection
    await file.deleteOne();

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

export default router;