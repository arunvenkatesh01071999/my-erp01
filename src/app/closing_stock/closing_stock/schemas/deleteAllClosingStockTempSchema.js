const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteAllClosingStockTempSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete users",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["cat_id", "outlet_id"],
        properties: {
            outlet_id: { type: 'integer' },
            cat_id: { type: 'integer' },
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

module.exports = deleteAllClosingStockTempSchema;
