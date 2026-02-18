// const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const { errorSchemas } = require("../../../commons/schemas/errorSchemas")

const getPendingStockViewSchema = {
    tags: ["getPendingStockView"],
    summary: "This API is to post getPendingStockView",
    headers: { $ref: "request-headers#" },
    body: {
        type: 'object',
        required: ["cat_id", "sub_cat_id", "outlet_id"],
        properties: {
            cat_id: { type: 'integer' },
            sub_cat_id: { type: 'integer' },
            outlet_id: { type: 'integer' }
        }
    }
};



module.exports = getPendingStockViewSchema;
