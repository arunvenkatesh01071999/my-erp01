const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getParentProductSchema = {
    tags: ["FNV ParentProduct"],
    summary: "This API is to get FNV ParentProduct",
    headers: { $ref: "request-headers#" },


    params: {
        type: "object"
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            pro_code: { type: "string" },
                            short_name: { type: "string" },
                            pro_description: { type: "string" },
                            regional_name: { type: "string" },
                            pro_name: { type: "string" },
                            batch_item: { type: "boolean" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getParentProductSchema;
