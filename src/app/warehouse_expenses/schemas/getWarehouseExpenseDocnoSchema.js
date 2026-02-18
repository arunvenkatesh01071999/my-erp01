const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getWarehouseExpenseDocnoSchema = {
    tags: ["HEADS"],
    summary: "This API is to post Purchase",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            warehouse_id: { type: "integer" }
        },
        required: ["warehouse_id"]
    },

    response: {
        200: {
            type: "object",
            properties: {
                doc_no: { type: 'string' }
            },
        },
        ...errorSchemas,
    },
};

module.exports = getWarehouseExpenseDocnoSchema;
