import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { config } from './src/config/env.js';

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start HTTP server
    const server = http.createServer(app);
    server.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`  Medical E-Commerce Backend Server                 `);
      console.log(`  Port:    ${config.port}                           `);
      console.log(`  Mode:    ${config.nodeEnv}                        `);
      console.log(`  URL:     http://localhost:${config.port}          `);
      console.log(`  API:     http://localhost:${config.port}/api/v1   `);
      console.log(`====================================================`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Fatal initialization error:', error);
    process.exit(1);
  }
};

startServer();
