const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postWastageSchema = {
    tags: ["Wastage"],
    summary: "API for managing Wastage records.",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: [
            "w_year","outlet_id", "w_date", "w_tot", "w_vatcstamt", "w_gtot", "w_uid",
            "w_muid", "w_roundoff", "w_pgtot", "w_others",
            "w_delstat", "w_remark", "w_packid", "wastage_details"
        ],
        properties: {
            w_year: { type: "integer" },
            outlet_id: { type: "integer" },
            w_date: { type: "string", format: "date" },
            w_tot: { type: "number" },
            w_vatcstamt: { type: "number"},
            w_gtot: { type: "number" },
            w_uid: { type: "integer" },
            w_muid: { type: "integer" },
            w_roundoff: { type: "number"},
            w_comid: { type: "integer" },
            w_pgtot: { type: "number" },
            w_others: { type: "number"},
            w_delstat: { type: "integer" },
            w_remark: { type: "string" },
            w_packid: { type: "integer" },
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
                        wd_id: { type: "string" },
                        wd_year: { type: "integer" },
                        wd_date: { type: "string" },
                        wd_slno: { type: "integer" },
                        wd_prdid: { type: "integer" },
                        wd_batchno: { type: "string" },
                        wd_expdate: { type: "string"},
                        wd_qty: { type: "number" },
                        wd_dis: { type: "number" },
                        wd_disamt: { type: "number"},
                        wd_vat: { type: "number" },
                        wd_vatamt: { type: "number" },
                        wd_rate: { type: "string" },
                        wd_amt: { type: "string" },
                        wd_comid: { type: "integer" },
                        wd_prate: { type: "string" },
                        wd_pamt: { type: "number" },
                        wd_suppid: { type: "integer" },
                        wd_reason_id: { type: "integer" },
                        wd_whstock: { type: "number"},
                        wd_dne: { type: "string" }
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

module.exports = postWastageSchema;
