const { errorSchemas } = require("../../../commons/schemas/errorSchemas");
const { params } = require("./getSyncSupplierOutletMappingSchema");

const putSupplierByOutletMappingSchema = {
    tags: ["PUT SUPPLIER REVERSE FLAG"],
    summary: "This API is to fetch update supplier details details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            outlet_id: { type: "string" },
            local_supplier_mapping: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "string", enum: ["1"] }, // Always "1" in response
            },
        },
        ...errorSchemas
    }
};

module.exports = putSupplierByOutletMappingSchema;
