const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getMerchantCategoryEditDetailsSchema = {
    tags: ["CATEGORY EDIT"],
    summary: "This API is to fetch merchant category edit details",
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
                status: { type: "string", enum: ["1", "0"] }, // Always "1" in response
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    Clientid: { type: "string" }, // Client ID as string
                                    Locid: { type: "string" }, // Location ID as string
                                    mcid: { type: "string" }, // Merchant Category ID
                                    mcname: { type: "string" }, // Merchant Category Name
                                    status: { type: "string", enum: ["1"] } // Always "1"
                                },
                                required: ["Clientid", "Locid", "mcid", "mcname", "status"]
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

module.exports = getMerchantCategoryEditDetailsSchema;
