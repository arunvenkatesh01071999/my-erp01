const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPaymentDocnoSchema = {
    tags: ["PAYMENT DOC NO"],
    summary: "This API is to get payment docno",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            properties: {
                Docno: { type: "string" },
            }
        },
        ...errorSchemas
    }
};

module.exports = getPaymentDocnoSchema;
