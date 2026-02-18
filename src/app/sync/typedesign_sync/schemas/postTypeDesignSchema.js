const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postTypeDesignSchema = {
    tags: ["TYPEDESIGN"],
    summary: "This API is to fetch typedesign",
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

module.exports = postTypeDesignSchema;
