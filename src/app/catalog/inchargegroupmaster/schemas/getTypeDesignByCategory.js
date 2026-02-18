const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getTypeDesignByCategorySchema = {
    tags: ["TYPEDESIGN CATEGORY"],
    summary: "This API is to get typedesign category",
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
                    type_name: { type: "string" }, // Updated field name from `cateogory_name` to `type_name`
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

module.exports = getTypeDesignByCategorySchema;
