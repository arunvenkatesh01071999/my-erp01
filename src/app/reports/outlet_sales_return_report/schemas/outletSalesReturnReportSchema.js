const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const outletSalesReturnReportSchema = {
    tags: ["outletSales Return Report"],
    summary: "This API is to get outletSales return report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["from_date", "to_date", "customer"],
        additionalProperties: false,
        properties: {
            from_date: { type: "string", format: "date" },
            to_date: { type: "string", format: "date" },
            customer: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    docno: { type: "string" },
                    docdate: { type: "string", format: "date" },
                    salesman_id: { type: "integer" },
                    outletid: { type: "integer" },
                    amount: { type: "number" },
                    subtotal_amount: { type: "number" },
                    gst_per: { type: "number" },
                    gst_amt: { type: "number" },
                    cess_per: { type: "number" },
                    cess_amt: { type: "number" },
                    roff: { type: "number" },
                    outstanding: { type: "number" },
                    is_credit: { type: "integer" },
                    bill_no: { type: "string" },
                    company_id: { type: "integer" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                    mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
                    party_name: { type: "string" },
                    gst_in: { type: "string" },
                    address: { type: "string" },
                    add2: { type: "string" },
                    add3: { type: "string" },
                    add4: { type: "string" },
                    is_refund: { type: "boolean" },
                    discount_amount: { type: "number" },
                    // pincode: { type: "string" },
                    // state: { type: "integer" },
                    // state_name: { type: "string" },
                    // country: { type: "integer" },
                    // country_name: { type: "string" },
                    // phone: { type: "string", pattern: "^[0-9]{10,12}$" },
                    // email: { type: "string", format: "email" },
                    // website: {
                    //     type: "string",
                    //     pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)*/?$"
                    // },
                    // gstin: { type: "string" },
                    // fssai: { type: "string" },
                    // outlet_type: { type: "integer" },
                    // outlet_type_name: { type: "string" },
                    // bankacno: { type: "string" },
                    // bankname: { type: "string" },
                    // acname: { type: "string" },
                    // ifsccode: { type: "string" },
                    // is_gst: { type: "boolean" },
                    outlet_sales_lines: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                docno: { type: "string" },
                                docdate: { type: "string", format: "date" },
                                outletid: { type: "integer" },
                                prodid: { type: "integer" },
                                dis_per: { type: "number" },
                                dis_amt: { type: "number" },
                                mrp: { type: "number" },
                                rate: { type: "number" },
                                qty: { type: "number" },
                                gst_per: { type: "number" },
                                gst_amt: { type: "number" },
                                cess_per: { type: "number" },
                                cess_amt: { type: "number" },
                                barcode: { type: "string" },
                                company_id: { type: "integer" },
                                created_at: { type: "string", format: "date-time" },
                                updated_at: { type: "string", format: "date-time" },
                                created_by: { type: "integer" },
                                updated_by: { type: "integer" },
                                head_id: { type: "integer" },
                                type_id: { type: "integer" },
                                subcat_id: { type: "integer" },
                                cat_id: { type: "integer" },
                                uom_id: { type: "integer" },
                                pro_name: { type: "string" },
                                pro_code: { type: "string" },
                                units_short_name: { type: "string" },
                                head_name: { type: "string" },
                                type_name: { type: "string" },
                                category_name: { type: "string" },
                                subcategory_name: { type: "string" }

                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = outletSalesReturnReportSchema;
