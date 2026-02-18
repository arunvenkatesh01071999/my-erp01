const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const putFmcgPlanningIssueSchema = {
    tags: ["ProductPlanning"],
    summary: "This API is for managing Product Planning Issues.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            planning_issue_id: { type: "integer" }
        }
    },
    body: {
        type: "object",
        required: ["pp_date", "pp_year", "product_plan_details", "product_plan_requests"],
        properties: {
            pp_date: { type: "string", format: "date-time", errorMessage: "pp_date must be a valid date-time format" },
            pp_time: { type: "string", format: "date-time", errorMessage: "pp_time must be a valid date-time format" },
            pp_kitissmst: { type: "string", errorMessage: "pp_kitissmst must be a string" },
            pp_uid: { type: "integer", errorMessage: "pp_uid must be an integer" },
            pp_cid: { type: "integer", errorMessage: "pp_cid must be an integer" },
            pp_year: { type: "integer", errorMessage: "pp_year must be an integer" },

            product_plan_details: {
                type: "array",
                minItems: 1,
                errorMessage: "product_plan_details must be a non-empty array",
                items: {
                    type: "object",
                    required: ["ppd_matid", "ppd_qty", "ppd_tin", "ppd_cid", "ppd_year"],
                    properties: {
                        ppd_id: { type: "integer", errorMessage: "ppd_id must be an integer" },
                        ppd_srlno: { type: "integer", errorMessage: "ppd_srlno must be an integer" },
                        ppd_matid: { type: "integer", errorMessage: "ppd_matid must be an integer" },
                        ppd_qty: { type: "number", errorMessage: "ppd_qty must be a number" },
                        ppd_tin: { type: "number", errorMessage: "ppd_tin must be a number" },
                        ppd_cid: { type: "integer", errorMessage: "ppd_cid must be an integer" },
                        ppd_year: { type: "integer", errorMessage: "ppd_year must be an integer" }
                    }
                }
            },

            product_plan_requests: {
                type: "array",
                minItems: 1,
                errorMessage: "product_plan_requests must be a non-empty array",
                items: {
                    type: "object",
                    required: ["ppr_matid", "ppr_qty", "ppr_availqty", "ppr_cost", "ppr_cid", "ppr_year"],
                    properties: {
                        ppr_id: { type: "integer", errorMessage: "ppr_id must be an integer" },
                        ppr_srlno: { type: "integer", errorMessage: "ppr_srlno must be an integer" },
                        ppr_matid: { type: "integer", errorMessage: "ppr_matid must be an integer" },
                        ppr_qty: { type: "number", errorMessage: "ppr_qty must be a number" },
                        ppr_availqty: { type: "number", errorMessage: "ppr_availqty must be a number" },
                        ppr_cost: { type: "number", errorMessage: "ppr_cost must be a number" },
                        ppr_cid: { type: "integer", errorMessage: "ppr_cid must be an integer" },
                        ppr_year: { type: "integer", errorMessage: "ppr_year must be an integer" }
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




module.exports = putFmcgPlanningIssueSchema;
