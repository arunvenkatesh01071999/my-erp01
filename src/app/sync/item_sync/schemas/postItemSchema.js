const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postItemSchema = {
    tags: ["UNITS"],
    summary: "This API is to fetch items",
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

module.exports = postItemSchema;
