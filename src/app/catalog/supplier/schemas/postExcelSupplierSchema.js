// const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

// const postExcelSupplierSchema = {
//     tags: ["SUPPLIER"],
//     summary: "This API is to post multiple suppliers",
//     headers: { $ref: "request-headers#" },
//     body: {
//         type: "array",
//         minItems: 1,
//         items: {
//             type: "object",
//             required: ["supplier_name", "short_name", "outlets"],
//             properties: {
//                 supplier_name: { type: "string" },
//                 short_name: { type: "string" },
//                 supplier_code: { type: "string" },
//                 type: { type: "integer" },
//                 add1: { type: "string" },
//                 add2: { type: "string" },
//                 add3: { type: "string" },
//                 add4: { type: "string" },
//                 company_id: { type: "integer" },
//                 country: { type: "string" },
//                 state: { type: "string" },
//                 city: { type: "string" },
//                 pincode: { type: "string" },
//                 phone: { type: "string" },
//                 mobile: { type: "string" },
//                 email: { type: "string" },
//                 website: { type: "string" },
//                 gstin: { type: "string" },
//                 // type: { type: "string" },
//                 bankacno: { type: "string" },
//                 bankname: { type: "string" },
//                 acname: { type: "string" },
//                 ifsccode: { type: "string" },
//                 is_active: { type: "boolean" },
//                 fssai: { type: "string" },
//                 op_bal: { type: "string" },
//                 pan_number: { type: "string" },
//                 product_type: { type: "string" },
//                 payment_terms: { type: "string" },
//                 fssai_expiry: {
//                     type: "string",
//                     format: "date",
//                     errorMessage: "fssai_expiry must be a valid date in YYYY-MM-DD format"
//                 },
//                 pan_status: {
//                     type: "integer",
//                     enum: [0, 1],
//                     description: "PAN status — 0 or 1 only"
//                 },
//                 gst_status: {
//                     type: "integer",
//                     enum: [0, 1, 2, 3],
//                     description: "GST status — allowed values are 0, 1, 2, 3"
//                 },
//                 gst_type: { type: "string" },

//                 outlets: {
//                     type: "array",
//                     minItems: 1,
//                     items: {
//                         type: "object",
//                         required: ["outlet_id"],
//                         properties: {
//                             outlet_id: {
//                                 type: "integer",
//                                 errorMessage: "Outlet ID must be an integer"
//                             }
//                         }
//                     }
//                 },
//             }
//         }
//     },
//     response: {
//         200: {
//             type: "object",
//             properties: {
//                 success: { type: "boolean" },
//                 failed: {
//                     type: "array",
//                     items: {
//                         type: "object",
//                         properties: {
//                             supplier_name: { type: "string" },
//                             reason: { type: "string" }
//                         },
//                         required: ["supplier_name", "reason"]
//                     }
//                 }
//             }
//         },
//         ...errorSchemas
//     }

// };

// module.exports = postExcelSupplierSchema;


const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postExcelSupplierSchema = {
    tags: ["SUPPLIER"],
    summary: "This API is to post multiple suppliers",
    headers: { $ref: "request-headers#" },

    body: {
        type: "array",
        minItems: 1,
        items: {
            type: "object",
            required: ["supplier_name", "short_name"],
            properties: {
                supplier_name: { type: "string" },
                short_name: { type: "string" },
                supplier_code: { type: "string" },
                add1: { type: "string" },
                add2: { type: "string" },
                country_name: { type: "string" },
                state_name: { type: "string" },
                city_name: { type: "string" },
                pincode: { type: "string" },
                contact_person: { type: "string" },
                designation: { type: "string" },
                phone: { type: "string" },
                mobile: { type: "string" },
                email: { type: "string" },
                alter_mobile_no: { type: "string" },
                alter_email: { type: "string" },
                gstin: { type: "string" },
                msme_applicable: { type: "boolean" },
                msme_number: { type: "string" },
                msme_declaration: { type: "string" },
                gst_status: {
                    type: "integer",
                    enum: [0, 1, 2, 3],
                    description: "GST status allowed values: 0,1,2,3"
                },
                gst_type: { type: "string" },
                pan_number: { type: "string" },
                pan_status: {
                    type: "integer",
                    enum: [0, 1],
                    description: "PAN status: 0 or 1"
                },
                fssaino: { type: "string" },
                fssai_expiry: {
                    type: "string",
                    format: "date",
                    errorMessage: "fssai_expiry must be a valid date in YYYY-MM-DD format"
                },
                bank_ac_no: { type: "string" },
                bankname: { type: "string" },
                acname: { type: "string" },
                ifsccode: { type: "string" },
                product_type: { type: "string" },
                payment_terms: { type: "string" },
                credit_days: { type: "integer" },
                month_days: { type: "integer" },
                is_active: { type: "boolean" },
                purchase: { type: "boolean" },
                transfer: { type: "boolean" },
                region_id: {
                    type: "integer",
                    enum: [17, 35],
                    description: "Region Id: 17 or 35"
                },
                warehouse_type: {
                    type: "integer",
                    enum: [0, 1],
                    description: "Ware house type: 0 or 1"
                },
                outlets: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        required: ["outlet_id"],
                        properties: {
                            outlet_id: {
                                type: "integer",
                                errorMessage: "Outlet ID must be an integer"
                            }
                        }
                    }
                },
            }
        }
    },

    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                failed: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["supplier_name", "reason"],
                        properties: {
                            supplier_name: { type: "string" },
                            reason: { type: "string" }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = postExcelSupplierSchema;
