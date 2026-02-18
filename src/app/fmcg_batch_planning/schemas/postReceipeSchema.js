const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postReceipeSchema = {
    tags: ["ProductPlan"],
    summary: "This API is for managing Product Plan records.",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["receipe_details"],
        properties: {
            p_comid: { type: "integer", errorMessage: "p_comid must be an integer" },
            created_by: { type: "integer", errorMessage: "created_by must be an integer" },
            updated_by: { type: "integer", errorMessage: "updated_by must be an integer" },
            receipe_details: {
                type: "array",
                minItems: 1,
                errorMessage: "product_plan_details must be a non-empty array",
                items: {
                    type: "object",
                    required: ["pmd_srlno", "pmd_matid", "pmd_qty", "pmd_comid"],
                    properties: {
                        pmd_id: { type: "integer", errorMessage: "pmd_id must be an integer" },
                        pmd_srlno: { type: "integer", errorMessage: "pmd_srlno must be an integer" },
                        pmd_matid: { type: "integer", errorMessage: "pmd_matid must be an integer" },
                        pmd_qty: { type: "number", errorMessage: "pmd_qty must be a number" },
                        pmd_uom: { type: "string", errorMessage: "pmd_uom must be a string" },
                        pmd_fullqty: { type: "number", errorMessage: "pmd_fullqty must be a number" },
                        pmd_prdqty: { type: "number", errorMessage: "pmd_prdqty must be a number" },
                        pmd_comid: { type: "integer", errorMessage: "pmd_comid must be an integer" },
                        pmd_temp: { type: "number", errorMessage: "pmd_temp must be a number" }
                    }
                }
            }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postReceipeSchema;
