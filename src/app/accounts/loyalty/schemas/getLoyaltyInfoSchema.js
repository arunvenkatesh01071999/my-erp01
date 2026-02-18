const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getLoyaltyInfoSchema = {
    tags: ["ROLE"],
    summary: "This API is to get roles",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                loyalty_amount: { type: "number" },
                loyalty_points: { type: "number" },
                redemption_amount: { type: "number" },
                redemption_percentage: { type: "number" },
                company_id: { type: "integer" },
                is_active: { type: "boolean" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getLoyaltyInfoSchema;
