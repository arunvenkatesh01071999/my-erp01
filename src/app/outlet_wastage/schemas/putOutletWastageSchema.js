const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const putWastageSchema = {
    tags: ["Wastage Update"],
    summary: "API for managing Wastage records.",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            wastage_id: { type: "integer" }
        }
    },
    body: {
        type: "object",
        required: [
            "w_year", "outlet_id", "w_date", "w_tot", "w_vatcstamt", "w_gtot", "w_uid",
            "w_muid", "w_roundoff", "w_pgtot", "w_others",
            "w_delstat", "w_remark", "w_packid", "wastage_details"
        ],
        properties: {
            w_year: { type: "integer", errorMessage: "w_year must be an integer" },
            outlet_id: { type: "integer", errorMessage: "outlet_id  must be an integer" },
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
            w_delstat: { type: "integer", errorMessage: "w_delstat must be an integer" },
            w_remark: { type: "string", errorMessage: "w_remark must be a string" },
            w_packid: { type: "integer", errorMessage: "w_packid must be an integer" },
            wastage_details: {
                type: "array",
                minItems: 1,
                errorMessage: "wastage_details must be a non-empty array",
                items: {
                    type: "object",
                    required: [
                        "wd_id", "wd_year", "wd_date", "wd_slno", "wd_prdid",
                        "wd_batchno", "wd_expdate", "wd_qty", "wd_dis", "wd_disamt",
                        "wd_vat", "wd_vatamt", "wd_rate", "wd_amt", "wd_comid",
                        "wd_prate", "wd_pamt", "wd_suppid", "wd_reason_id", "wd_whstock",
                        "wd_dne"
                    ],
                    properties: {
                        wd_id: { type: "integer", errorMessage: "wd_id must be an integer" },
                        wd_year: { type: "integer", errorMessage: "wd_year must be an integer" },
                        wd_date: { type: "string", format: "date-time", errorMessage: "wd_date must be a valid date-time format" },
                        wd_slno: { type: "integer", errorMessage: "wd_slno must be an integer" },
                        wd_prdid: { type: "integer", errorMessage: "wd_prdid must be an integer" },
                        wd_batchno: { type: "string", errorMessage: "wd_batchno must be a string" },
                        wd_expdate: { type: "string", errorMessage: "wd_expdate must be a string" },
                        wd_qty: { type: "string", errorMessage: "wd_qty must be a string" },
                        wd_dis: { type: "number", errorMessage: "wd_dis must be a number" },
                        wd_disamt: { type: "number", errorMessage: "wd_disamt must be a number" },
                        wd_vat: { type: "number", errorMessage: "wd_vat must be a number" },
                        wd_vatamt: { type: "number", errorMessage: "wd_vatamt must be a number" },
                        wd_rate: { type: "string", errorMessage: "wd_rate must be a string" },
                        wd_amt: { type: "string", errorMessage: "wd_amt must be a string" },
                        wd_comid: { type: "integer", errorMessage: "wd_comid must be an integer" },
                        wd_prate: { type: "string", errorMessage: "wd_prate must be a string" },
                        wd_pamt: { type: "number", errorMessage: "wd_pamt must be a number" },
                        wd_suppid: { type: "integer", errorMessage: "wd_suppid must be an integer" },
                        wd_reason_id: { type: "integer", errorMessage: "wd_reason_id must be an integer" },
                        wd_whstock: { type: "number", errorMessage: "wd_whstock must be a number" },
                        wd_dne: { type: "string", errorMessage: "wd_dne must be a string" }
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

module.exports = putWastageSchema;
