const axios = require("axios");
const qs = require("qs");

function whatsAppRepo(fastify) {
    async function sendThanksSales(bill_number, phone_number) {

        const data = JSON.stringify({
            "merchantId": 18454,
            "eventId": 41138,
            "wabaNumber": "917810032223",
            "recipients": [
                phone_number
            ],
            "source": "crm",
            "clientRefId": bill_number,
            "params": {
                "body": [
                    bill_number
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
        sendThanksSales
    };
}
module.exports = whatsAppRepo;
