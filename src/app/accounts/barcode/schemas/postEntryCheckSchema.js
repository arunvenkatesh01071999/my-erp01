const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const postEntryCheckSchema = {
    body: {
        type: 'object',
        required: ['barcode'],
        properties: {
            // prod_id: { type: 'integer' },
            // outlet_id: { type: 'integer' },
            barcode: { type: 'string', minLength: 12, maxLength: 15 }
        }
    }
};

module.exports = postEntryCheckSchema;

