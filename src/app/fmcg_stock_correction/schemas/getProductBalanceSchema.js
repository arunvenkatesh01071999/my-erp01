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
                    batch_item: { type: "boolean" },
                    expiry_value: { type: "integer" },
                    pro_name: { type: "string" },
                    purchase_rate: { type: "string" },
                    sale_rate: { type: "string" },
                    balance: { type: "string" },
                    mrp: { type: "string" },
                    physical_qty: { type: "string" }
                },
                required: [
                    "id", "pro_code", "batch_item", "expiry_value", "pro_name",
                    "purchase_rate", "sale_rate", "balance", "physical_qty"
                ]
            }
        },
        ...errorSchemas
    }
};

module.exports = getProductBalanceSchema;
