const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const postBarcodeCheckSchema = {
    body: {
        type: 'object',
        required: ['prod_id', 'outlet_id', 'starting_barcode', 'ending_barcode'],
        properties: {
            prod_id: { type: 'integer' },
            outlet_id: { type: 'integer' },
            starting_barcode: { type: 'string', minLength: 12, maxLength: 12 },
            ending_barcode: { type: 'string', minLength: 12, maxLength: 12 }
        }
    }
};

module.exports = postBarcodeCheckSchema;

