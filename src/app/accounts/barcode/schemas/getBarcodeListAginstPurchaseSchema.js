const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBarcodeListAginstPurchaseSchema = {
    tags: ["GET BARCODE LIST AGAINST PURCHASE"],
    summary: "This API is to get barcode list against purchase",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" },
            prod_id: { type: "integer" },
            purchase_no: { type: "string" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    sub_title: { type: "string" },
                    mrp: { type: "string" },
                    barcode: { type: "string" },
                    is_active: { type: "boolean" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getBarcodeListAginstPurchaseSchema;
