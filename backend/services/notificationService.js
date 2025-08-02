const logger = require('../utils/logger');

/**
 * Simulates sending a notification for report status update
 * @param {number} reportId - Report ID
 * @param {string} status - New status
 */
const notifyStatusUpdate = (reportId, status) => {
  logger.info(`Notification: Report ${reportId} status updated to ${status}`);
};

/**
 * Simulates sending a notification for complaint status update
 * @param {number} complaintId - Complaint ID
 * @param {string} status - New status
 */
const notifyComplaintStatus = (complaintId, status) => {
  logger.info(`Notification: Complaint ${complaintId} status updated to ${status}`);
};

module.exports = { notifyStatusUpdate, notifyComplaintStatus };