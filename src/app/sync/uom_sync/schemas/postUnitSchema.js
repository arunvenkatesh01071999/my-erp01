const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postUnitsSchema = {
    tags: ["UNITS"],
    summary: "This API is to fetch units",
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

module.exports = postUnitsSchema;
