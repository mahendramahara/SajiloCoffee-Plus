import fs from 'fs';
import path from 'path';

const logDir = 'logs';
const logFile = path.join(logDir, 'system.log');
const errorLogFile = path.join(logDir, 'error.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const formatLogMessage = (level, message, metadata = {}) => {
  const timestamp = new Date().toISOString();
  const metadataStr = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metadataStr}\n`;
};

export const systemLogger = {
  info: (message, metadata = {}) => {
    const logMessage = formatLogMessage('info', message, metadata);
    fs.appendFileSync(logFile, logMessage);
    console.log(`ℹ️  ${message}`);
  },

  warn: (message, metadata = {}) => {
    const logMessage = formatLogMessage('warn', message, metadata);
    fs.appendFileSync(logFile, logMessage);
    console.warn(`⚠️  ${message}`);
  },

  error: (message, error = null, metadata = {}) => {
    const errorMetadata = { ...metadata };
    if (error) {
      errorMetadata.error = error.message;
      errorMetadata.stack = error.stack;
    }
    
    const logMessage = formatLogMessage('error', message, errorMetadata);
    fs.appendFileSync(errorLogFile, logMessage);
    console.error(`❌ ${message}`, error || '');
  },

  activity: (userId, action, details = {}) => {
    const activityMessage = `User ${userId} performed: ${action}`;
    const metadata = { userId, action, ...details };
    
    const logMessage = formatLogMessage('activity', activityMessage, metadata);
    fs.appendFileSync(logFile, logMessage);
    console.log(`🔄 ${activityMessage}`);
  },

  security: (message, metadata = {}) => {
    const logMessage = formatLogMessage('security', message, metadata);
    fs.appendFileSync(logFile, logMessage);
    fs.appendFileSync(errorLogFile, logMessage);
    console.warn(`🔐 SECURITY: ${message}`);
  },

  order: (orderId, action, userId, details = {}) => {
    const orderMessage = `Order ${orderId} ${action}`;
    const metadata = { orderId, action, userId, ...details };
    
    const logMessage = formatLogMessage('order', orderMessage, metadata);
    fs.appendFileSync(logFile, logMessage);
    console.log(`📋 ${orderMessage}`);
  },

  subscription: (subscriptionId, action, userId, details = {}) => {
    const subMessage = `Subscription ${subscriptionId} ${action}`;
    const metadata = { subscriptionId, action, userId, ...details };
    
    const logMessage = formatLogMessage('subscription', subMessage, metadata);
    fs.appendFileSync(logFile, logMessage);
    console.log(`💳 ${subMessage}`);
  }
};
