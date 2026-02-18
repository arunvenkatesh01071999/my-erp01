const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPurchaseOrderPonoSchema = {
    tags: ["Purchase Order"],
    summary: "This API is to get purchase order no",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" }
        },
        required: ["company_id"]
    },
    response: {
        200: {
            type: "object",
            properties: {
                Docno: { type: "string" },
            },
        },
        ...errorSchemas,
    },
};

module.exports = getPurchaseOrderPonoSchema;
