const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const excelSkuMappingSchema = {
    tags: ["SKU MAPPING"],
    summary: "This API is to post sku mapping",
    headers: { $ref: "request-headers#" },
    body: {
        type: "array",
        minItems: 1,
        items: {
            type: "object",
            required: ["sku_code"],
            properties: {
                sku_code: { type: "string" },
                outlet_name: { type: "string" },
                outlet_code: { type: "string" },
                supplier_name: { type: "string" },
                supplier_code: { type: "string" },
            }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                // failed: {
                //     type: "array",
                //     items: {
                //         type: "object",
                //         properties: {
                //             supplier_name: { type: "string" },
                //             reason: { type: "string" }
                //         },
                //         required: ["supplier_name", "reason"]
                //     }
                // }
            }
        },
        ...errorSchemas
    }

};

module.exports = excelSkuMappingSchema;
