const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletCitiesSchema = {
    tags: ["Outlet City List"],
    summary: "This API is to get Outlet City List",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    city_id: { type: "integer" },
                    city_name: { type: "string" }

                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getOutletCitiesSchema;
