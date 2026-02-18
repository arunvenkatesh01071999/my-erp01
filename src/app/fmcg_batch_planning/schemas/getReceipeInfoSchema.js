const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getReceipeInfoSchema = {
    tags: ["FMCG Receipe Info"],
    summary: "This API is to get FMCG Receipe Info",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        properties: {
            receipe_id: { type: "integer" }
        }
    },
    response: {
        200: {
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


        },
        ...errorSchemas
    }
};

module.exports = getReceipeInfoSchema;
