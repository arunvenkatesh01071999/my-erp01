const axios = require("axios");
const qs = require("qs");

function smsRepo(fastify) {
  async function sendSms(phone_number, otp) {
    const data = qs.stringify({
      to: phone_number,
      type: process.env.OTP_TYPE,
      sender: process.env.OTP_SENDER,
      body: `Your OTP for HealthUNO  Mobile app. / online registration is ${otp} - HealthUNO.${otp}`,
      template_id: process.env.OTP_TEMPLATE_ID
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.OTP_URL,
      headers: {
        "Content-Type": process.env.OTP_CONTENT_TYPE,
        "api-key": process.env.OTP_API_KEY
      },
      data
    };
    console.log(process.env.OTP_TYPE);
    return axios
      .request(config)
      .then(response => {
        const re_data = JSON.stringify(response.data);
        return re_data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  return {
    sendSms
  };
}
module.exports = smsRepo;
