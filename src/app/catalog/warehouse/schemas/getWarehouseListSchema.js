const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getWareHouseListSchema = {
    tags: ["WareHouse"],
    summary: "This API is to get Consumer",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    wh_id: { type: "integer" },
                    warehouse_name: { type: "string" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getWareHouseListSchema;
