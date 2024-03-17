/**
 * Wraps a request handler function to handle asynchronous operations
 * @param {Function} requestHandler - The request handler function to be wrapped
 * @returns {Function} - A new function that handles asynchronous operations
 */
const asyncHandler = (requestHandler) => {
  // Return a new function that takes req, res, and next as arguments
  return (req, res, next) => {
    // Wrap the original request handler in a Promise.resolve()
    // and catch any errors with next(err)
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
