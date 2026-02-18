const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putExpenceSchema = {
    tags: ["HEADS"],
    summary: "This API is to post Purchase",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            id: { type: "integer" }
        }
    },
    body: {
        type: "object",
        required: ["accid", "amount", "company_id"],
        properties: {
            docdate: { type: "string" },
            accid: { type: "integer" },
            amount: { type: "number" },
            remarks: { type: "string" },
            company_id: { type: "integer" },

        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
            },
        },
        ...errorSchemas,
    },
};

module.exports = putExpenceSchema;
