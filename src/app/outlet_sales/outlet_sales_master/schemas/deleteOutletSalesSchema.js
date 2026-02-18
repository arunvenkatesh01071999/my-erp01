const { errorSchemas } = require("../../../commons/schemas/errorSchemas");



const deleteOutletSalesSchema = {
    tags: ["OutletSalesMaster"],
    summary: "This API is to post OutletSalesMaster",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["outlet_sales_id", "outlet_id", "docno"],
        properties: {
            outlet_sales_id: { type: "integer" },
            outlet_id: { type: "integer" },
            docno: { type: "string" }

        }
    },
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

module.exports = {
    deleteOutletSalesSchema
}

