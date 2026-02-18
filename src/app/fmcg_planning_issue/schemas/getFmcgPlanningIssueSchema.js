const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getFmcgPlanningIssueSchema = {
    tags: ["FMCG Planning Issue"],
    summary: "This API is to get FMCG Planning Issue",
    headers: { $ref: "request-headers#" },

    queryString: {
        type: "object",
        required: ["status", "search"],
        additionalProperties: false,
        properties: {
            search: { type: "string", default: "" },
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
        },
    },

    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" }
        }
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
                            pp_id: { type: "integer", errorMessage: "pp_id must be an integer" },
                            pp_date: { type: "string", format: "date-time", errorMessage: "pp_date must be a valid date-time format" },
                            pp_time: { type: "string", format: "date-time", errorMessage: "pp_time must be a valid date-time format" },
                            pp_kitissmst: { type: "string", errorMessage: "pp_kitissmst must be a string" },
                            pp_uid: { type: "integer", errorMessage: "pp_uid must be an integer" },
                            pp_cid: { type: "integer", errorMessage: "pp_cid must be an integer" },
                            pp_year: { type: "integer", errorMessage: "pp_year must be an integer" },
                            created_at: { type: "string" },
                            updated_at: { type: "string" },
                            product_plan_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        ppd_id: { type: "integer", errorMessage: "ppd_id must be an integer" },
                                        ppd_srlno: { type: "integer", errorMessage: "ppd_srlno must be an integer" },
                                        ppd_matid: { type: "integer", errorMessage: "ppd_matid must be an integer" },
                                        pro_name: { type: "string", errorMessage: "pro_name must be an string" },
                                        ppd_qty: { type: "number", errorMessage: "ppd_qty must be a number" },
                                        ppd_tin: { type: "number", errorMessage: "ppd_tin must be a number" },
                                        ppd_cid: { type: "integer", errorMessage: "ppd_cid must be an integer" },
                                        ppd_year: { type: "integer", errorMessage: "ppd_year must be an integer" }
                                    }
                                }
                            },
                            product_plan_requests: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        ppr_id: { type: "integer", errorMessage: "ppr_id must be an integer" },
                                        ppr_srlno: { type: "integer", errorMessage: "ppr_srlno must be an integer" },
                                        ppr_matid: { type: "integer", errorMessage: "ppr_matid must be an integer" },
                                        pro_name: { type: "string", errorMessage: "pro_name must be an string" },
                                        ppr_qty: { type: "number", errorMessage: "ppr_qty must be a number" },
                                        ppr_availqty: { type: "number", errorMessage: "ppr_availqty must be a number" },
                                        ppr_cost: { type: "number", errorMessage: "ppr_cost must be a number" },
                                        ppr_cid: { type: "integer", errorMessage: "ppr_cid must be an integer" },
                                        ppr_year: { type: "integer", errorMessage: "ppr_year must be an integer" }
                                    }
                                }
                            },
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getFmcgPlanningIssueSchema;
