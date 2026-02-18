const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesGroupWiseAllReportSchema = {
    tags: ["Sales Groupwise All outlet Report"],
    summary: "This API is to get sales itemwise report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "customer", "category", "subcategory", "type", "head"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            customer: { type: "integer" },
            category: { type: "integer" },
            subcategory: { type: "integer" },
            type: { type: "integer" },
            head: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    outlets_names_header: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                outlet_code: { type: "string" },
                                outlet_name: { type: "string" }
                            }
                        }
                    },
                    category_name: { type: ["string", "null"] },
                    subcategory_name: { type: "string" },
                    type_name: { type: "string" },
                    head_name: { type: "string" },
                    total_qty: { type: "number" },
                    total_amount: { type: "number" },
                    outlet_details: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                outlet_code: { type: "string" },
                                outlet_name: { type: "string" },
                                total_qty: { type: "number" },
                                total_amount: { type: "number" }
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = salesGroupWiseAllReportSchema;


// const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

// const salesGroupWiseAllReportSchema = {
//     tags: ["Sales Groupwise All outlet Report"],
//     summary: "This API is to get sales itemwise report",
//     headers: { $ref: "request-headers#" },
//     body: {
//         type: "object",
//         required: ["from_date", "to_date", "customer", "category", "subcategory", "type", "head"],
//         additionalProperties: false,
//         properties: {
//             from_date: { type: "string", format: "date" },
//             to_date: { type: "string", format: "date" },
//             customer: { type: "integer" },
//             category: { type: "integer" },
//             subcategory: { type: "integer" },
//             type: { type: "integer" },
//             head: { type: "integer" }
//         }
//     },
//     response: {
//         200: {
//             type: "array",
//             items: {
//                 type: "object",
//                 properties: {
//                     category_name: { type: "string" },
//                     subcategory_name: { type: "string" },
//                     type_name: { type: "string" },
//                     head_name: { type: "string" },
//                     total_qty: { type: "number" },
//                     total_amount: { type: "string" },
//                     outlet_details: {
//                         type: "array",
//                         items: {
//                             type: "object",
//                             properties: {
//                                 outlet_id: { type: "integer" },
//                                 outlet_code: { type: "string" },
//                                 outlet_name: { type: "string" },
//                                 total_qty: { type: "number" },
//                                 total_amount: { type: "number" }
//                             }
//                         }
//                     }



//                 }
//             }
//         },
//         ...errorSchemas
//     }
// };

// module.exports = salesGroupWiseAllReportSchema;
