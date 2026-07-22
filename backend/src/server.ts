import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n👋 Database connection closed. Server shutting down...');
  process.exit(0);
});

startServer();
