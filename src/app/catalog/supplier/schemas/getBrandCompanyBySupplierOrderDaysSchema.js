const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierOrderDaysBrandSchema = {
    tags: ["SUPPLIER Outlet Mapping Order Days with Brand name"],
    summary: "API to list Supplier outlet mapping order days with brand name",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            region_id: { type: "integer" },
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
                    brand_company_id: { type: "integer" },
                    brand_company: { type: "string" },
                    sunday: { type: "boolean" },
                    monday: { type: "boolean" },
                    tuesday: { type: "boolean" },
                    wednesday: { type: "boolean" },
                    thursday: { type: "boolean" },
                    friday: { type: "boolean" },
                    saturday: { type: "boolean" }
                }
            }

        },

        ...errorSchemas
    }
};

module.exports = getSupplierOrderDaysBrandSchema;
