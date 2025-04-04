const sendResponse = (res, statusCode = 500, message, data = null, metadata = null) => {
    const success = statusCode >= 200 && statusCode < 300;
  
    const responseStructure = {
      success,
      message,
      ...(data && { data }),
      ...(metadata && { metadata }),
    };
  
    return res.status(statusCode).json(responseStructure);
  };
  
  module.exports = sendResponse;
  