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
                            pmd_id: { type: "integer", errorMessage: "pmd_id must be an integer" },
                            p_comid: { type: "integer", errorMessage: "p_comid must be an integer" },
                            receipe_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        pmd_id: { type: "integer", errorMessage: "pmd_id must be an integer" },
                                        pmd_srlno: { type: "integer", errorMessage: "pmd_srlno must be an integer" },
                                        pmd_matid: { type: "integer", errorMessage: "pmd_matid must be an integer" },
                                        pro_name: { type: "string", errorMessage: "pro_name must be an string" },
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
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getFmcgPlanningInwardSchema;
