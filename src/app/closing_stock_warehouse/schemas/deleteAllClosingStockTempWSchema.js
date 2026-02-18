const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteAllClosingStockTempWSchema = {
    tags: ["DELETE USERS"],
    summary: "This API is to delete users",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["cat_id", "sub_cat_id"],
        properties: {
            cat_id: { type: 'integer' },
            sub_cat_id: { type: 'integer' },
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

module.exports = deleteAllClosingStockTempWSchema;
