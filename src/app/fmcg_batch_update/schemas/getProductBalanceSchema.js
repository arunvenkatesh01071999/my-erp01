const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getProductBalanceSchema = {
    tags: ["Products"],
    summary: "Get Product Balance",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    pro_code: { type: "string" },
                    pro_name: { type: "string" },
                    expiry_value: { type: "integer" },
                    expiry_type_id: { type: "integer" },
                    unit_name: { type: "string" }
                },
                required: [
                    "id",
                    "pro_code",
                    "pro_name",
                    "expiry_value",
                    "expiry_type_id",
                    "unit_name"
                ]
            }
        },
        ...errorSchemas
    }
};

module.exports = getProductBalanceSchema;
