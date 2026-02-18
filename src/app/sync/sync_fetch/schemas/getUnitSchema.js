const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getUnitScheme = {
    tags: ["UNITS"],
    summary: "This API is to fetch units",
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
                status: { type: "string", enum: ["1", "0"] },
                message: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    MUOM_clientid: { type: "string" },
                                    MUOM_id: { type: "string" },
                                    MUOM_name: { type: "string" }
                                },
                                required: ["MUOM_clientid", "MUOM_id", "MUOM_name"]
                            }
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

module.exports = getUnitScheme;
