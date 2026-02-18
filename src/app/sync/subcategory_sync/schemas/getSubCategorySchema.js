const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubCategorySchema = {
    tags: ["SUBCATEGORY"],
    summary: "This API is to fetch subcategories",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    subcategory_name: { type: "string" },
                    category_name: { type: "string" },
                    subcategory_image: { type: "string" },
                    category_id: { type: "integer" },
                    company_id: { type: "integer" },
                    is_inserted: { type: "boolean" },
                    is_active: { type: "boolean" }
                }
            },
            meta: { $ref: "response-meta#" }
        },

        ...errorSchemas
    }
};

module.exports = getSubCategorySchema;
