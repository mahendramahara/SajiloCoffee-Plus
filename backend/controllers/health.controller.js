import mongoose from 'mongoose';
import { success, error } from '../utils/apiResponse.js';

export const healthCheck = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        name: mongoose.connection.name
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };

    if (dbStatus === 'disconnected') {
      return error(res, 'Database connection failed', 503, healthData);
    }

    return success(res, healthData, 'System is healthy');
  } catch (err) {
    return error(res, 'Health check failed', 500, {
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
};
