const sendResponse = (res, statusCode, success, message, data = null, error = null, metadata = null) => {
    return res.status(statusCode).json({ success, message, data, error, metadata });
};

module.exports = sendResponse;
