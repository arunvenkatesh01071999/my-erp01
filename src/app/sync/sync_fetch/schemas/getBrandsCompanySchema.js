const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBrandsCompanySchema = {
    tags: ["BRANDS COMPANY"],
    summary: "This API is to fetch brands company",
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
                                    bcid: { type: "string" }, // ID as string
                                    bcname: { type: "string" }, // Brand name
                                    br_clientid: { type: "string", enum: ["1"] } // Always "1"
                                },
                                required: ["bcid", "bcname", "br_clientid"]
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

module.exports = getBrandsCompanySchema;
