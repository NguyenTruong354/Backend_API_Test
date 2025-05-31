// Success response helper
function successResponse(message, data, statusCode) {
  return {
    success: true,
    message,
    statusCode,
    data
  };
}

// Error response helper
function errorResponse(message, data = null, statusCode) {
  return {
    success: false,
    message,
    statusCode,
    data
  };
}

module.exports = {
  successResponse,
  errorResponse
};