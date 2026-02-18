const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWarehouseCityWiseSchema = {
    tags: ["Outlet City List"],
    summary: "This API is to get Outlet City List",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    city_id: { type: "integer" },
                    city_name: { type: "string" },
                    warehouse: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                warehouse_name: { type: "string" },
                                is_active: { type: "boolean" }
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getWarehouseCityWiseSchema;
