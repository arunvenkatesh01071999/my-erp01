const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getClosingStockTempDetailsSchema = {
    tags: ["OutletSalesMaster"],
    summary: "This API is to post OutletSalesMaster",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["prod_id"],
        properties: {
            prod_id: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                id: { type: "integer" },
                pro_id: { type: "integer" },
                pro_code: { type: "string" },
                outlet_id: { type: "integer" },
                opng_stock: { type: "string" },
                balnc_stock: { type: "string" },
                company_id: { type: "integer" },
                is_active: { type: "boolean" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" },
                created_by: { type: "integer" },
                updated_by: { type: ["integer", "null"] },
                pro_name: { type: "string" },
                type: { type: "integer" },
                sub_cat: { type: "integer" },
                uom: { type: "integer" },
                head_id: { type: "integer" },
                cat_id: { type: "integer" },
                barcode: { type: "string" },
                pur_rate: { type: "string" },
                sale_rate: { type: "string" },
                wholesale_rate: { type: "string" },
                mrp: { type: "string" },
                gst: { type: "string" },
                cess: { type: "string" },
                hsn: { type: "string" },
                op_stk: { type: "string" },
                balance: { type: "string" },
                min_stock: { type: "string" },
                allow_neg_stk: { type: "boolean" },
                wscale: { type: "boolean" },
                vendor: { type: "integer" },
                units_short_name: { type: "string" },
                cateogory_name: { type: "string" },
                subcategory_name: { type: "string" },
                type_name: { type: "string" },
                category_name: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getClosingStockTempDetailsSchema;