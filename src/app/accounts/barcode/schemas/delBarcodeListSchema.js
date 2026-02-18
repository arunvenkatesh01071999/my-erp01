const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const delBarcodeListSchema = {
    body: {
        type: 'object',
        required: ['barcode'],
        properties: {
            barcode: {
                type: 'array',
                items: { type: 'string' }
            }
        }
    }
};

module.exports = delBarcodeListSchema;
