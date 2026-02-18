const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCategooryEditDetailsSchema = {
    tags: ["CATEGORY EDIT"],
    summary: "This API is to fetch category edit",
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
                                    clientid: { type: "string" }, // Client ID as string
                                    locid: { type: "string" }, // Location ID as string
                                    cm_id: { type: "string" }, // Category ID
                                    cm_name: { type: "string" }, // Category Name
                                    cm_parent: { type: "string" }, // Parent Category ID
                                    status: { type: "string", enum: ["1"] } // Always "1"
                                },
                                required: ["clientid", "locid", "cm_id", "cm_name", "cm_parent", "status"]
                            }
                        },
                        { type: "string" }

                    ]

                }
            },
            required: ["status", "message"]
        },
        ...errorSchemas
    }
};

module.exports = getCategooryEditDetailsSchema;
