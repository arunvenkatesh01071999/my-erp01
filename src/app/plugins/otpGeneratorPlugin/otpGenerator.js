const jwt = require("jsonwebtoken");

function generateOtpAndToken(phone_number) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ phone_number, otp }, process.env.JWT_SECRET_KEY, {
    expiresIn: "120s"
  });
  return { otp, token };
}

module.exports = generateOtpAndToken;
