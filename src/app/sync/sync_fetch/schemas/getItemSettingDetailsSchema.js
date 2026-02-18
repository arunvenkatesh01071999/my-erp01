const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemSettingDetailsSchema = {
    tags: ["ITEM SETTING"],
    summary: "This API fetches item setting details",
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
                status: { type: "string", enum: ["1","0"] }, // Always "1" in response
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    Clientid: { type: "string" }, // Client ID
                                    Locid: { type: "string" }, // Location ID
                                    ProdId: { type: "string" }, // Product ID
                                    // FIXED: integer instead of string
                                    SActive: { type: "integer", enum: [1, 0] },
                                    PActive: { type: "integer", enum: [1, 0] },
                                    Status: { type: "integer", enum: [1, 0] },
                                    EDate: { type: "string", format: "date-time" }, // Expiry Date
                                    Etime: { type: "string", format: "date-time" }, // Expiry Time
                                    pmargin: { type: "string" }, // Profit margin
                                    Barcode1: { type: "string" }, // First barcode
                                    Barcode2: { type: "string" }, // Second barcode
                                    Barcode3: { type: "string" }, // Third barcode (optional)
                                    Barcode4: { type: "string" }, // Fourth barcode (optional)
                                    UID: { type: "string" } // Unique ID
                                },
                                required: [
                                    "Clientid",
                                    "Locid",
                                    "ProdId",
                                    "SActive",
                                    "PActive",
                                    "Status",
                                    "EDate",
                                    "Etime",
                                    "pmargin",
                                    "Barcode1",
                                    "Barcode2",
                                    "Barcode3",
                                    "Barcode4",
                                    "UID"
                                ]
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

module.exports = getItemSettingDetailsSchema;
