const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingStockSchema = {
    tags: ["ClosingStockCount"],
    summary: "This API is to post ClosingStockCount",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["cat_id", "sub_cat_id"],
        properties: {
            cat_id: { type: 'integer' },
            sub_cat_id: { type: 'integer' },
            outlet_id: { type: 'integer' }
        }
    }
};



module.exports = postClosingStockSchema;
