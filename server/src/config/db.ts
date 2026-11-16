import dns from 'dns';
import mongoose from 'mongoose';

// Ensure SRV DNS resolution succeeds across all ISPs and local routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if not allowed
}

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autoforge';
    await mongoose.connect(mongoURI);
    console.log(`[AutoForge Server] MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`[AutoForge Server] MongoDB Connection Error:`, error);
    // Continue running so API can function even if Mongo Atlas is connecting
    console.warn(`[AutoForge Server] Running in mock/fallback mode if DB is unavailable.`);
  }
};

