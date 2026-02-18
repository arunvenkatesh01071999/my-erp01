const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const deleteShrinkageSchema = {
    tags: ["Delete Shrinkage"],
    summary: "This API is for managing Shrinkage.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            shrinkage_id: { type: "integer" }
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




module.exports = deleteShrinkageSchema;
