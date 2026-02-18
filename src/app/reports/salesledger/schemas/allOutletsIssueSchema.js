const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const allOutletsIssueSchema = {
    tags: ["All Outlets issue reports"],
    summary: "This API is to get all Outlets issue reports",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            from_year: {
                type: "string",
                pattern: "^[0-9]{4}$" // Regular expression for 4-digit year format
            },
            to_year: {
                type: "string",
                pattern: "^[0-9]{4}$" // Regular expression for 4-digit year format
            },
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                total_no_of_bills: { type: "integer" },
                total_amount: { type: "number" },
                details: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            outlet_id: { type: "integer" },
                            code: { type: "string" },
                            short_name: { type: "string" },
                            fullname: { type: "string" },
                            bills: { type: "integer" },
                            total: { type: "number" }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = allOutletsIssueSchema;
