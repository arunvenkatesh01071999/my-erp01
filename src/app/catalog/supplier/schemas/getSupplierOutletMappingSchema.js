const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierOutletMappingSchema = {
    tags: ["SUPPLIER OUTLET MAPPING"],
    summary: "API to list supplier outlet mapping order days",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" },
            outlet_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    supplier_name: { type: "string" },
                    short_name: { type: "string" },
                    add1: { type: "string" },
                    add2: { type: "string" },
                    add3: { type: "string" },
                    add4: { type: "string" },
                    pincode: { type: "string" },
                    phone: { type: "string" },
                    mobile: { type: "string" },
                    email: { type: "string" },
                    website: { type: "string" },
                    gstin: { type: "string" },
                    op_bal: { type: "string" },
                    balance: { type: "string" },
                    custtype: { type: "string" },
                    bank_ac_no: { type: "string" },
                    bankname: { type: "string" },
                    ac_name: { type: "string" },
                    ifsccode: { type: "string" },
                    company_id: { type: "integer" },
                    is_active: { type: "boolean" },
                    fssaino: { type: "string" },
                    supplier_code: { type: "string" },
                    // nested objects
                    state: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            name: { type: "string" }
                        }
                    },
                    city: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            name: { type: "string" }
                        }
                    },
                    country: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            name: { type: "string" }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSupplierOutletMappingSchema;
