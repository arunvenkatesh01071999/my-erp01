const axios = require("axios");
const qs = require("qs");

function smsOtpRepo(fastify) {
    async function sendOtpSms(phone_number, otp) {
        // const data = qs.stringify({
        //     to: phone_number,
        //     type: process.env.OTP_TYPE,
        //     sender: process.env.OTP_SENDER,
        //     body: `Your OTP for HealthUNO  Mobile app. / online registration is ${otp} - HealthUNO.${otp}`,
        //     template_id: process.env.OTP_TEMPLATE_ID
        // });

        // const config = {
        //     method: "post",
        //     maxBodyLength: Infinity,
        //     url: process.env.OTP_URL,
        //     headers: {
        //         "Content-Type": process.env.OTP_CONTENT_TYPE,
        //         "api-key": process.env.OTP_API_KEY
        //     },
        //     data
        // };
        // console.log(process.env.OTP_TYPE);
        // return axios
        //     .request(config)
        //     .then(response => {
        //         const re_data = JSON.stringify(response.data);
        //         return re_data;
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });

        // whats app

        const data = JSON.stringify({
            "merchantId": 18454,
            "eventId": 41598,
            "wabaNumber": "917810032223",
            "recipients": [
                phone_number
            ],
            "source": "crm",
            "clientRefId": otp,
            "params": {
                "body": [
                    otp
                ]
            }
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.dotpe.in/api/comm/public/enterprise/v1/wa/send',
            headers: {
                'Dotpe-Api-Key': 'dpmat-NZRdmjaYFDsjbXEvOz6xR7OUqDTLeRHxWRAFLQ2XqH4hyzMTBjomO9SFMW7Mw0lnZKz3nIYcRQBde3OfgLaOqc',
                'Content-Type': 'application/json'
            },
            data: data
        };


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
        sendOtpSms
    };
}
module.exports = smsOtpRepo;
