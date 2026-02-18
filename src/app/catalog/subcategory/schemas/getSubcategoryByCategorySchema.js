const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubcategoryByCategorySchema = {
    tags: ["SUB CATEGORY INFO"],
    summary: "This API is to fetch subcategories by category",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            category_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array", // Updated to array since the response contains a list
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    subcategory_name: { type: "string" },
                    category_id: { type: "integer" },
                    category_name: { type: "string" },
                    is_active: { type: "boolean" }
                }
            }
        },

        ...errorSchemas
    }
};

module.exports = getSubcategoryByCategorySchema;
