const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");


const getOutletSalesByDatePaginateSchema = {
    tags: ["DATE OUTLET SALES"],
    summary: "This API is to  customers sales by dates",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            date: { type: "string" },
            page_size: { type: "integer" },
            current_page: { type: "integer" }
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
                            id: { type: "integer" },
                            docno: { type: "string" },
                            docdate: { type: "string", format: "date" },
                            partycode: { type: "integer" },
                            amount: { type: "integer" },
                            subtotal_amount: { type: "integer" },
                            gst_per: { type: "integer" },
                            gst_amt: { type: "integer" },
                            cess_per: { type: "integer" },
                            cess_amt: { type: "integer" },
                            roff: { type: "integer" },
                            mode: { type: "string" },
                            outstanding: { type: "integer" },
                            company_id: { type: "integer" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: "string", format: "date-time" },
                            code: { type: "string" },
                            short_name: { type: "string" },
                            fullname: { type: "string" },
                            add1: { type: "string" },
                            add2: { type: "string" },
                            add3: { type: "string" },
                            add4: { type: "string" },
                            city: { type: "integer" },
                            city_name: { type: "string" },
                            pincode: { type: "string" },
                            state: { type: "integer" },
                            state_name: { type: "string" },
                            country: { type: "integer" },
                            country_name: { type: "string" },
                            phone: { type: "string", pattern: "^[0-9]{10,12}$" },
                            mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
                            email: { type: "string", format: "email" },
                            website: {
                                type: "string",
                                pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)*/?$"
                            },
                            gstin: { type: "string" },
                            fssai: { type: "string" },
                            outlet_type: { type: "integer" },
                            outlet_type_name: { type: "string" },
                            bankacno: { type: "string" },
                            bankname: { type: "string" },
                            acname: { type: "string" },
                            ifsccode: { type: "string" },
                            is_gst: { type: "boolean" },
                            outlet_sales_lines: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        docno: { type: "string" },
                                        docdate: { type: "string", format: "date" },
                                        sales_mst_id: { type: "integer" },
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
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getOutletSalesByDatePaginateSchema;
