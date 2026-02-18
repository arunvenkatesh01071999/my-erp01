const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteWastageSchema = {
    tags: ["Delete Wastage"],
    summary: "This API is for managing Wastage.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            wastage_id: { type: "integer" }
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




module.exports = deleteWastageSchema;
