const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBrandEditDetailsSchema = {
    tags: ["BRAND EDIT"],
    summary: "This API is to fetch brand edit",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            oultlet_id: { type: "integer" }
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
                                    bid: { type: "string" }, // Brand ID
                                    bname: { type: "string" }, // Brand Name
                                    bcid: { type: "string" }, // Brand Category ID
                                    status: { type: "string", enum: ["1"] } // Always "1"
                                },
                                required: ["Clientid", "Locid", "bid", "bname", "bcid", "status"]
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

module.exports = getBrandEditDetailsSchema;
