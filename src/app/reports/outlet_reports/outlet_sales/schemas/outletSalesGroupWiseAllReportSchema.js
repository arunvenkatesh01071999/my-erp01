const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");

const outletSalesGroupWiseAllReportSchema = {
    tags: ["Sales Groupwise All outlet Report"],
    summary: "This API is to get sales itemwise report",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "object",
                        properties: {
                            outlets_names_header: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        outlet_code: { type: "string" },
                                        outlet_name: { type: "string" }
                                    },
                                    required: ["outlet_code", "outlet_name"]
                                }
                            }
                        },
                        required: ["outlets_names_header"]
                    },
                    {
                        type: "object",
                        properties: {
                            category_name: { type: ["string", "null"] },
                            subcategory_name: { type: ["string", "null"] },
                            type_name: { type: ["string", "null"] },
                            head_name: { type: ["string", "null"] },
                            total_qty: { type: ["number", "null"] },
                            total_amount: { type: ["number", "null"] },
                            outlet_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        outlet_code: { type: "string" },
                                        outlet_name: { type: "string" },
                                        total_qty: { type: "number" },
                                        total_amount: { type: "number" }
                                    },
                                    required: ["outlet_code", "outlet_name", "total_qty", "total_amount"]
                                }
                            }
                        },
                        required: ["category_name", "subcategory_name", "type_name", "head_name", "total_qty", "total_amount", "outlet_details"]
                    }
                ]
            }
        },
        ...errorSchemas
    }
};

module.exports = outletSalesGroupWiseAllReportSchema;
