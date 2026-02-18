const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getMerchantCategoorySchema = {
    tags: ["MERCHANT CATEGORY"],
    summary: "This API is to fetch merchant category",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            id: { type: "integer" }
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
                                    mcid: { type: "string" }, // ID as string
                                    mcname: { type: "string" }, // Brand name
                                    br_clientid: { type: "string", enum: ["1"] } // Always "1"
                                },
                                required: ["mcid", "mcname", "br_clientid"]
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

module.exports = getMerchantCategoorySchema;
