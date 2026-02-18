const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteClosingStockTempSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete users",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["prod_id", "barcode"],
        properties: {
            prod_id: { type: 'integer' },
            barcode: { type: 'string' }
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

module.exports = deleteClosingStockTempSchema;
