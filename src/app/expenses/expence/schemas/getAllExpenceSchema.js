const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAllExpenceSchema = {
    tags: ["HEADS"],
    summary: "This API is to post Purchase",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            from_date: { type: "string" },
            to_date: { type: "string" }
        }
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: 'integer' },
                    docno: { type: 'string' },
                    docdate: { type: 'string' },
                    accid: { type: 'integer' },
                    amount: { type: 'string' },
                    remarks: { type: 'string' },
                    company_id: { type: 'integer' },
                    cateogory_name: { type: 'string' },
                    account_name: { type: 'string' }
                }
            }
        },
        ...errorSchemas,
    },
};

module.exports = getAllExpenceSchema;


module.exports = getAllExpenceSchema;
