const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSchemeTypeSchema = {
    tags: ["Scheme Type"],
    summary: "This API is to get banners",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    scheme_type: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSchemeTypeSchema;
