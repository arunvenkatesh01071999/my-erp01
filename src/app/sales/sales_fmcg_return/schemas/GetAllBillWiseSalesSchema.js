const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBillwiseSalesSchema = {
    tags: ["Sales"],
    summary: "Get Billwise Sales Report",
    headers: { $ref: "request-headers#" },

    querystring: {
        type: "object",
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            search: { type: "string" },
            invoice_no: { type: "string" },
            sales_type: { type: "integer" }
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
                            id: { type: "string" },
                            invoice_no: { type: "integer" },
                            doc_date: { type: "string", format: "date" },
                            customer_name: { type: "string" },
                            customer_address: { type: "string" },
                            customer_id: { type: "integer" },
                            sales_type: { type: "integer" },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        product_id: { type: "integer" },
                                        pro_code: { type: "string" },
                                        pro_name: { type: "string" },
                                        sale_qty: { type: "string" },
                                        unit_name: { type: "string" },
                                        sale_rate: { type: "string" },
                                        mrp: { type: "string" },
                                        a_qty: { type: "number" },
                                        a_free: { type: "number" },
                                        dis_per: { type: "string" },
                                        dis_amt: { type: "string" },
                                        gst: { type: "string" },
                                        igst: { type: "string" },
                                        cess: { type: "string" }
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

module.exports = getBillwiseSalesSchema;
