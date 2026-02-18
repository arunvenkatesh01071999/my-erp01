const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletCityWiseSchema = {
    tags: ["Outlet City List"],
    summary: "This API is to get Outlet City List",
    headers: { $ref: "request-headers#" },
    queryString: {
        type: "object",
        additionalProperties: false,
        properties: {
            warehouse: { type: "string", default: 0 },
        },
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    city_id: { type: "integer" },
                    city_name: { type: "string" },
                    outlets: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                code: { type: "string" },
                                short_name: { type: "string" },
                                fullname: { type: "string" },
                                is_active: { type: "boolean" },
                                bankid: { type: "string" },
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getOutletCityWiseSchema;
