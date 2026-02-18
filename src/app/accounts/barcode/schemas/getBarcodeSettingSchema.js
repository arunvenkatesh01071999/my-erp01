const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBarcodeSettingSchema = {
    tags: ["GET BARCODE CONFIG"],
    summary: "This API is to get barcode config",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                is_individual: { type: "integer" },
                company_id: { type: "integer" },
                is_active: { type: "boolean" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getBarcodeSettingSchema;
