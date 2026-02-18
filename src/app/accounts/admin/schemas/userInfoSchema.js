const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const userInfoSchema = {
    tags: ["USER'S INFO"],
    summary: "This API is to get users information",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",
            properties: {
                id: { type: "integer" },
                user_name: { type: "string" },
                user_email: { type: "string" },
                user_mobile: { type: "string" },
                user_password: { type: "string" },
                company_id: { type: "integer" },
                current_company_id: { type: "integer" },
                user_type: { type: "integer", enum: [0, 1, 2] },
                is_logging: { type: "boolean" },
                is_active: { type: "boolean" },
                roles: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            role_name: { type: "string" },
                            company_id: { type: "integer" },
                            is_outlet: { type: "boolean" },
                            is_warehouse: { type: "boolean" },
                            is_active: { type: "boolean" }
                        },
                        default: []
                    }
                },

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
                            pincode: { type: "string" },
                            country_id: { type: "integer" },
                            state_id: { type: "integer" },
                            city_id: { type: "integer" },
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
                            is_gst: { type: "boolean" },
                            balance: { type: "string" },
                            credit_limit: { type: "string" },
                            limitation: { type: "string" },
                            wallet_balance: { type: "string" },
                            ref_doc_no: { type: "string" },
                            for_indent: { type: "integer" },
                            warehouse_id: { type: "integer" },
                            is_active: { type: "boolean" },
                            newout: { type: "integer" },
                            export: { type: "integer" },
                            putaway: { type: "integer" },
                            putawat_per: { type: "string" },
                            wow: { type: "string" },
                            bankid: { type: "string" }
                        }
                    },
                    default: []
                },

                warehouse: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            warehouse_id: { type: "integer" },
                            warehouse_name: { type: "string" },
                            warehouse_short_name: { type: "string" },
                            is_active: { type: "boolean" }
                        }
                    },
                    default: []
                },

                company: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            code: { type: "string" },
                            company_short_name: { type: "string" },
                            company_fullname: { type: "string" },
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
                            is_active: { type: "boolean" }
                        }
                    },
                    default: []
                },

                // salesmandetails: {
                //     type: "array",
                //     items: {
                //         type: "object"
                //     },
                //     default: []
                // }
            },
            required: ["id", "user_name", "user_email", "roles", "outlets", "warehouse", "company", "salesmandetails"]
        },
        ...errorSchemas
    }
};

module.exports = userInfoSchema;
