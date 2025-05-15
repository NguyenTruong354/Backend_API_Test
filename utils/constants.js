// Success response helper
function successResponse(message, data) {
  return {
    success: true,
    message,
    data
  };
}

// Error response helper
function errorResponse(message, data = null) {
  return {
    success: false,
    message,
    data
  };
}

module.exports = {
  successResponse,
  errorResponse
};