/**
 * Sanitizes input to prevent XSS
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  return input.replace(/[<>&'"]/g, (char) => {
    const escape = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;' };
    return escape[char];
  });
};

module.exports = { sanitizeInput };