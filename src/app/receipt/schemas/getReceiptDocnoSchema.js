const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getReceiptDocnoSchema = {
    tags: ["RECEIPT DOC NO"],
    summary: "This API is to get receipt docno",
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

module.exports = getReceiptDocnoSchema;
