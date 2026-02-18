const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteAllClosingStockOutletSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete users",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["outlet_id"],
        properties: {
            outlet_id: { type: 'integer' },
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

module.exports = deleteAllClosingStockOutletSchema;
