const Collector = require("../models/collector");

const generateUniqueOtp = async () => {
  let otp;
  let exists = true;

  while (exists) {
    otp = Math.floor(1000 + Math.random() * 9000).toString();
    exists = await Collector.findOne({ staticOtp: otp });
  }

  return otp;
};

module.exports = generateUniqueOtp;
