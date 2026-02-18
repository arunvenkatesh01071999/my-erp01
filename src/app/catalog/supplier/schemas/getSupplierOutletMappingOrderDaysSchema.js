const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierOutletMappingOrderDaysSchema = {
    tags: ["SUPPLIER Outlet Mapping Order Days"],
    summary: "API to list Supplier outlet mapping order days",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        properties: {
            region_id: { type: "integer" },
            company_id: { type: "integer" },
            outlet_id: { type: "integer" },
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
                            brand_company_id: { type: "integer" },
                            brand_company: { type: "string" },

                            // 0 or 1 from DB → number
                            sunday: { type: "number" },
                            monday: { type: "number" },
                            tuesday: { type: "number" },
                            wednesday: { type: "number" },
                            thursday: { type: "number" },
                            friday: { type: "number" },
                            saturday: { type: "number" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },

        ...errorSchemas
    }
};

module.exports = getSupplierOutletMappingOrderDaysSchema;
