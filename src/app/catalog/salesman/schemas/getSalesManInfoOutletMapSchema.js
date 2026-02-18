const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesManInfoOutletMapSchema = {
    tags: ["SalesMan INFO"],
    summary: "This API retrieves SalesMan Info with Outlet Mapping",
    headers: { $ref: "request-headers#" },
    queryString: {
        type: "object",
        required: ["status", "search"],
        additionalProperties: false,
        properties: {
            status: { type: "integer", enum: [0, 1, 2], default: 0 },
            search: { type: "string", default: "" }
        },
    },
    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" },
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
                            sales_man_name: { type: "string" },
                            short_name: { type: "string" },
                            sales_man_code: { type: "string" },
                            company_id: { type: "integer" },
                            code: { type: "string" },
                            mobile: { type: "string" },
                            father_name: { type: "string" },
                            mother_name: { type: "string" },
                            dob: { type: "string" },
                            sex: { type: "string" },
                            add1: { type: "string" },
                            add2: { type: "string" },
                            add3: { type: "string" },
                            photo: { type: "string" },
                            id_proof: { type: "string" },
                            passbook: { type: "string" },
                            is_active: { type: "boolean" },
                            created_at: { type: "string" },
                            updated_at: { type: "string" },
                            created_by: { type: "integer" },
                            updated_by: { type: ["integer", "null"] },
                            outlet_id: { type: "integer" },
                            outlets: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        code: { type: "string" },
                                        short_name: { type: "string" },
                                        fullname: { type: "string" },
                                        add1: { type: "string" },
                                        add2: { type: "string" },
                                        add3: { type: "string" },
                                        add4: { type: "string" },
                                        city: { type: "integer" },
                                        pincode: { type: "string" },
                                        state: { type: "integer" },
                                        country: { type: "integer" },
                                        phone: { type: "string" },
                                        mobile: { type: "string" },
                                        email: { type: "string" },
                                        website: { type: "string" },
                                        gstin: { type: "string" },
                                        fssai: { type: "string" },
                                        outlet_type: { type: "integer" },
                                        bankacno: { type: "string" },
                                        bankname: { type: "string" },
                                        acname: { type: "string" },
                                        ifsccode: { type: "string" },
                                        company_id: { type: "integer" },
                                        is_active: { type: "boolean" },
                                        created_at: { type: "string" },
                                        updated_at: { type: "string" },
                                        created_by: { type: "integer" },
                                        updated_by: { type: "integer" },
                                        is_gst: { type: "boolean" },
                                        franchise_type: { type: "integer" },
                                        balance: { type: "string" },
                                        credit_limit: { type: "string" },
                                        limitation: { type: "string" },
                                        wallet_balance: { type: "string" },
                                        ref_doc_no: { type: "string" },
                                        for_indent: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                },
                meta: {
                    type: "object",
                    properties: {
                        pagination: {
                            type: "object",
                            properties: {
                                total: { type: "integer" },
                                page: { type: "integer" },
                                page_size: { type: "integer" }, // Fixed type
                                total_pages: { type: "integer" }
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas // Moved correctly inside response
    }
};

module.exports = getSalesManInfoOutletMapSchema;
