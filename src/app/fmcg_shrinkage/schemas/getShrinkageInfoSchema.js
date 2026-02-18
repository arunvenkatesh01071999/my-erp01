const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getShrinkageInfoSchema = {
    tags: ["FMCG Planning Inward Info"],
    summary: "This API is to get FMCG Planning Inward Info",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        properties: {
            shrinkage_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                w_id: { type: "integer", errorMessage: "w_id must be an integer" },
                w_year: { type: "integer", errorMessage: "w_year must be an integer" },
                w_date: { type: "string", format: "date-time", errorMessage: "w_date must be a valid date-time format" },
                w_tot: { type: "number", errorMessage: "w_tot must be a number" },
                w_vatcstamt: { type: "number", errorMessage: "w_vatcstamt must be a number" },
                w_gtot: { type: "number", errorMessage: "w_gtot must be a number" },
                w_uid: { type: "integer", errorMessage: "w_uid must be an integer" },
                w_muid: { type: "integer", errorMessage: "w_muid must be an integer" },
                w_roundoff: { type: "number", errorMessage: "w_roundoff must be a number" },
                w_comid: { type: "integer", errorMessage: "w_comid must be an integer" },
                w_pgtot: { type: "number", errorMessage: "w_pgtot must be a number" },
                w_others: { type: "number", errorMessage: "w_others must be a number" },
                w_delstat: { type: "integer", errorMessage: "w_delstat must be an integer", default: 0 },
                w_remark: { type: "string", errorMessage: "w_remark must be a string" },
                w_packid: { type: "integer", errorMessage: "w_packid must be an integer" },
                shrinkage_details: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", errorMessage: "id must be an integer" },
                            wd_year: { type: "integer", errorMessage: "wd_year must be an integer" },
                            wd_date: { type: "string", format: "date-time", errorMessage: "wd_date must be a valid date-time format" },
                            wd_slno: { type: "integer", errorMessage: "wd_slno must be an integer" },
                            wd_prdid: { type: "integer", errorMessage: "wd_prdid must be an integer" },
                            pro_name: { type: "string", errorMessage: "pro_name must be an string" },
                            product_code: { type: "string", errorMessage: "product_code must be an string" },
                            uom_id: { type: "integer", errorMessage: "uom_id must be an integer" },
                            unit_name: { type: "string", errorMessage: "unit_name must be an string" },
                            wd_batchno: { type: "string", errorMessage: "wd_batchno must be a string" },
                            wd_expdate: { type: "string", errorMessage: "wd_expdate must be a string" },
                            wd_qty: { type: "number", errorMessage: "wd_qty must be a number" },
                            wd_dis: { type: "number", errorMessage: "wd_dis must be a number" },
                            wd_disamt: { type: "number", errorMessage: "wd_disamt must be a number" },
                            wd_vat: { type: "number", errorMessage: "wd_vat must be a number" },
                            wd_vatamt: { type: "number", errorMessage: "wd_vatamt must be a number" },
                            wd_rate: { type: "number", errorMessage: "wd_rate must be a number" },
                            wd_amt: { type: "number", errorMessage: "wd_amt must be a number" },
                            wd_comid: { type: "integer", errorMessage: "wd_comid must be an integer" },
                            wd_prate: { type: "number", errorMessage: "wd_prate must be a number" },
                            wd_pamt: { type: "number", errorMessage: "wd_pamt must be a number" },
                            wd_suppid: { type: "integer", errorMessage: "wd_suppid must be an integer" },
                            reason_name: { type: "string", errorMessage: "reason_name must be a string" },
                            wd_reason_id: { type: "integer", errorMessage: "wd_reason_id must be a string" },
                        }
                    }
                }
            }


        },
        ...errorSchemas
    }
};

module.exports = getShrinkageInfoSchema;
