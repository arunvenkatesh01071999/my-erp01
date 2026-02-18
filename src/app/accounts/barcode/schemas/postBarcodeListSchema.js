const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postBarcodeListSchema = {
    tags: ["Barcode Config"],
    summary: "This API is to post barcode config",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",

        required: ["barcode_details"],
        properties: {

            barcode_details: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        prod_id: { type: "integer" },
                        barcode: { type: "string" },
                        is_sold: { type: "boolean" },
                        is_active: { type: "boolean" },
                        company_id: { type: "integer" },
                        outlet_id: { type: "integer" },
                        is_verified: { type: "integer" },
                        purchase_no: { type: "string" },
                        pro_code: { type: "string" },
                        opng_stock: { type: "number" },
                        balnc_stock: { type: "number" },
                        outlet_discount: { type: "number" }
                    },
                },
            },




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

module.exports = postBarcodeListSchema;
