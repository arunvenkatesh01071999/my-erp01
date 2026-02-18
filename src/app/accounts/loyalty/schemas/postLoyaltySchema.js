const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postLoyaltySchema = {
    tags: ["Loyalty"],
    summary: "This API is to post loyalty",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["loyalty_amount", "loyalty_points", "redemption_amount", "redemption_percentage", "company_id"],
        properties: {
            loyalty_amount: { type: "number" },
            loyalty_points: { type: "number" },
            redemption_amount: { type: "number" },
            redemption_percentage: { type: "number" },
            company_id: { type: "integer" }
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

module.exports = postLoyaltySchema;
