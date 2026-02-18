const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postBrandsDetailsSchema = {
    tags: ["BRANDS"],
    summary: "This API is to fetch brands",
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
                status: { type: "string", enum: ["1"] }, // Always "1" in response
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    br_id: { type: "string" }, // ID as string
                                    br_name: { type: "string" }, // Brand name
                                    active: { type: "string", enum: ["0", "1"] }, // Active status as "0" or "1"
                                    br_clientid: { type: "string", enum: ["1"] } // Always "1"
                                },
                                required: ["br_id", "br_name", "active", "br_clientid"]
                            },
                        },
                        { type: "string" } // For "Units not found" or error messages
                    ]

                }
            },
            required: ["status", "message"]
        },
        ...errorSchemas
    }
};

module.exports = postBrandsDetailsSchema;
