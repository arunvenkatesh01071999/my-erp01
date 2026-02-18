const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deletePurchaseFMCGGrnProductSchema = {
    tags: ["PURCHASE FMCG GRN PRODUCT SCHEMA"],
    summary: "This API is to delete a purchase GRN product schema",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        required: ["grn_id"],
        properties: {
            grn_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = deletePurchaseFMCGGrnProductSchema;
