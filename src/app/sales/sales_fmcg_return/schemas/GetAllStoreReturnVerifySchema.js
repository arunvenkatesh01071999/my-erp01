const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAllStoreReturnVerifySchema = {
    tags: ["Store Return"],
    summary: "Get All Store Return Verify",
    headers: { $ref: "request-headers#" },

    querystring: {
        type: "object",
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            search: { type: "string" }
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
                            doc_no: { type: "integer" },
                            doc_date: { type: "string", format: "date-time" },
                            invoice_no: { type: "string" },
                            customer_id: { type: "integer" },
                            customer_name: { type: "string" },
                            address_one: { type: "string" },
                            address_two: { type: "string" },
                            flag: { type: "integer" },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        product_id: { type: "integer" },
                                        pro_code: { type: "string" },
                                        pro_name: { type: "string" },
                                        unit_name: { type: "string" },
                                        mrp: { type: "string" },
                                        sale_rate: { type: "string" },
                                        accept_qty: { type: "number" },
                                        wh_qty: { type: "number" },
                                        de_qty: { type: "number" },
                                        r_qty: { type: "number" },
                                        cess: { type: "number" },
                                        gst: { type: "number" },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getAllStoreReturnVerifySchema;
