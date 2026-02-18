const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRegionSchema = {
    tags: ["Region List"],
    summary: "This API is to get region List",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    region_id: { type: "integer" },
                    region_name: { type: "string" },
                    prefix: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getRegionSchema;
