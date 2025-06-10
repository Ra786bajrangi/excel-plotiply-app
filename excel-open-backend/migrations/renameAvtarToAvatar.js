
import mongoose from 'mongoose';
import User from '../models/User.js'; // Adjust path as needed
import dotenv from 'dotenv';

// Load environment variables (for DB connection)
dotenv.config();

async function runMigration() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Rename `avtar` → `avatar` for all users
    const result = await User.updateMany(
      { avtar: { $exists: true } }, // Find docs where `avtar` exists
      { $rename: { avtar: 'avatar' } } // Rename the field
    );

    console.log(`♻️ Updated ${result.modifiedCount} documents`);
    console.log('🚀 Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    // 3. Disconnect from DB
    await mongoose.disconnect();
    process.exit(0);
  }
}

runMigration();