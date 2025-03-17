const sendResponse = (res, success, message, data = null, error = null, metadata = null) => {
    if (error && res.statusCode === 200) {
        res.status(500);
    }  
    return res.json({ success, message, data, error, metadata });
};

module.exports = sendResponse;
