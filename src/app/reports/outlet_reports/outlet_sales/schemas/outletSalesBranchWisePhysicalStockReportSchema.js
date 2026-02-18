const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");

const outletSalesBranchWisePhysicalStockReportSchema = {
    tags: ["Outlet Sales Itemwise Report"],
    summary: "This API is to get sales itemwise report",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["customer"],
        additionalProperties: false,
        properties: {
            customer: { type: "integer" },
            category: { type: "integer" },
            subcategory: { type: "integer" },
            head: { type: "integer" },
            type: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                totalQty: { type: "integer" },
                totalWhereHouseQty: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            // unsold_barcodes: {
                            //     type: "array",
                            //     items: { type: "string" }
                            // },
                            qty: { type: "integer" },
                            fullname: { type: "string" },
                            short_name: { type: "string" },
                            outlet_id: { type: "integer" },
                            head_name: { type: "string" },
                            type_name: { type: "string" },
                            category_name: { type: "string" },
                            subcategory_name: { type: "string" }
                        },
                        required: ["outlet_id"]
                    }
                }
            },
            required: ["totalQty", "totalWhereHouseQty", "data"]
        },
        ...errorSchemas
    }
};

module.exports = outletSalesBranchWisePhysicalStockReportSchema;
