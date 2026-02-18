const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const generateBarcodeSchema = {
    tags: ["Barcode Generate"],
    summary: "This API is to post barcode config",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["financial_year", "supplier_code", "prod_id", "purchase_no", "mrp", "qty", "company_id"],
        properties: {
            financial_year: { type: "integer" },
            supplier_code: { type: "integer" },
            prod_id: { type: "integer" },
            mrp: { type: "number" },
            qty: { type: "number" },
            purchase_no: { type: "string" },
            company_id: { type: "integer" },
            purchase_details_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = generateBarcodeSchema;
