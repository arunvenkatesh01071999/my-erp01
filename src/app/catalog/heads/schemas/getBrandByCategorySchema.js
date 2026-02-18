const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getHeadByCategorySchema = {
    tags: ["HEADS CATEGORY"],
    summary: "This API is to get Heads category",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            cat_id: { type: "integer" },
            sub_cat_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    cateogory_name: { type: "string" },
                    company_id: { type: "integer" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                    created_by: { type: "integer" },
                    updated_by: { type: "integer" },
                    is_active: { type: "boolean" },
                    is_inserted: { type: "boolean" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getHeadByCategorySchema;
