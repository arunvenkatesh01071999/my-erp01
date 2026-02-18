const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSubCategoryDetailsSchema = {
    tags: ["SUBCATEGORY"],
    summary: "This API is to fetch subcategories",
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
module.exports = postSubCategoryDetailsSchema;
