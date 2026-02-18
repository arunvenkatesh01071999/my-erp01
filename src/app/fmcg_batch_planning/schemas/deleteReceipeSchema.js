const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteReceipeSchema = {
    tags: ["Delete Receipe"],
    summary: "This API is for managing Receipes Masters.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            receipe_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        },
        ...errorSchemas
    }
};




module.exports = deleteReceipeSchema;
