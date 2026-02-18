const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postHeadsSchema = {
    tags: ["HEADS"],
    summary: "This API is to fetch heads",
    headers: { $ref: "request-headers#" },
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

module.exports = postHeadsSchema;
