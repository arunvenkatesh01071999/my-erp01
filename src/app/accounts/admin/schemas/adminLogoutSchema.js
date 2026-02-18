const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const adminLogoutSchema = {
    tags: ["ADMIN LOGOUT"],
    summary: "This API is to login admin users",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = adminLogoutSchema;
