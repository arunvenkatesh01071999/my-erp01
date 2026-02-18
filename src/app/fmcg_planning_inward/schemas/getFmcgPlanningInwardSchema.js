const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getFmcgPlanningInwardSchema = {
    tags: ["FMCG Planning Inward"],
    summary: "This API is to get FMCG Planning Inward",
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
                            p_id: { type: "integer", errorMessage: "p_id must be an integer" },
                            p_date: { type: "string", format: "date-time", errorMessage: "p_date must be a valid date-time format" },
                            p_year: { type: "integer", errorMessage: "p_year must be an integer" },
                            p_uid: { type: "integer", errorMessage: "p_uid must be an integer" },
                            p_muid: { type: "integer", errorMessage: "p_muid must be an integer" },
                            p_comid: { type: "integer", errorMessage: "p_comid must be an integer" },
                            p_remark: { type: "string", errorMessage: "p_remark must be a string" },
                            plan_inward_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    required: ["pd_prdid", "pd_qty", "pd_comid", "pd_year"],
                                    properties: {
                                        pd_id: { type: "integer", errorMessage: "pd_id must be an integer" },
                                        pd_year: { type: "integer", errorMessage: "pd_year must be an integer" },
                                        pd_date: { type: "string", format: "date-time", errorMessage: "pd_date must be a valid date-time format" },
                                        pd_slno: { type: "integer", errorMessage: "pd_slno must be an integer" },
                                        pd_prdid: { type: "integer", errorMessage: "pd_prdid must be an integer" },
                                        pro_name: { type: "string", errorMessage: "pro_name must be an string" },
                                        pd_batchno: { type: "string", errorMessage: "pd_batchno must be a string" },
                                        pd_expdate: { type: "string", errorMessage: "pd_expdate must be a string" },
                                        pd_qty: { type: "number", errorMessage: "pd_qty must be a number" },
                                        pd_comid: { type: "integer", errorMessage: "pd_comid must be an integer" }
                                    }
                                }
                            }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getFmcgPlanningInwardSchema;
