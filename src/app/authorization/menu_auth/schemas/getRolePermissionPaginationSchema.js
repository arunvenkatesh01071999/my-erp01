const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRolePermissionPaginationSchema = {
    tags: ["GET ROLE PERMISSION"],
    summary: "This API retrieves role permissions",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            user_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    is_active: { type: "boolean" },
                                    user_name: { type: "string" },
                                    user_type: { type: "integer" },
                                    company_id: { type: "integer" },
                                    created_at: { type: "string", format: "date-time" },
                                    created_by: { type: "integer" },
                                    is_logging: { type: "boolean" },
                                    updated_at: { type: "string", format: "date-time" },
                                    updated_by: { type: "integer" },
                                    user_email: { type: "string" },
                                    user_mobile: { type: "string" },
                                    user_password: { type: "string" },
                                    login_updated_at: { type: "string", format: "date-time" },
                                    password_updated_at: { type: "string", format: "date-time" }
                                }
                            },
                            role_id: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        is_active: { type: "boolean" },
                                        is_outlet: { type: "boolean" },
                                        role_name: { type: "string" },
                                        company_id: { type: "integer" },
                                        created_at: { type: "string", format: "date-time" },
                                        created_by: { type: "integer" },
                                        updated_at: { type: "string", format: "date-time" },
                                        updated_by: { type: "integer" },
                                        is_warehouse: { type: "boolean" }
                                    }
                                }
                            },
                            is_active: { type: "boolean" },
                            Password: { type: "string" },
                            Activity: { type: "string" },
                            Access: { type: "string" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getRolePermissionPaginationSchema;
