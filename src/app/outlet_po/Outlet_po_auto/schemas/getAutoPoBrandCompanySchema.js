const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAutoPoBrandCompanySchema = {
    tags: ["Product"],
    summary: "API to list products with detailed information",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            outlet_id: { type: "integer" },
            supplier_id: { type: "integer" },
            company_id: { type: "integer" }
        },
        required: ["outlet_id", "supplier_id", "company_id"]
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    brand_company_id: { type: "integer" },
                    brand_company: { type: "string" },

                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getAutoPoBrandCompanySchema;
