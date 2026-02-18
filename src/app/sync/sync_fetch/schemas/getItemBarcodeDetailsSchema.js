const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemBarcodeDetailsSchema = {
    tags: ["ITEM BARCODE"],
    summary: "This API fetches item barcode details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            outlet_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                status: { type: "string", enum: ["1"] }, // Always "1" in response
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    clientid: { type: "string" }, // Client ID
                                    prd_id: { type: "string" }, // Product ID
                                    barcode: { type: "string" }, // Primary barcode
                                    uid: { type: "string" }, // Unique ID
                                    modify_time: { type: "string", format: "date-time" }, // Modification timestamp
                                    Barcode1: { type: "string" }, // First barcode
                                    Barcode2: { type: "string" }, // Second barcode (optional)
                                    Barcode3: { type: "string" }, // Third barcode (optional)
                                    Barcode4: { type: "string" }, // Fourth barcode (optional)
                                    OIDs: { type: "string" } // Outlet IDs as a comma-separated string
                                },
                                required: ["clientid", "prd_id", "barcode", "uid", "modify_time", "Barcode1", "Barcode2", "Barcode3", "Barcode4", "OIDs"]
                            }
                        },
                        {
                            type: "string"
                        }
                    ]

                }
            },
            required: ["status", "message"]
        },
        ...errorSchemas
    }
};

module.exports = getItemBarcodeDetailsSchema;
