const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const getBarcodeCompleteHistorySchema = {
    body: {
        type: 'object',
        required: ['barcode'],
        properties: {
            barcode: { type: 'string', minLength: 12, maxLength: 12 },
        }
    }
};

module.exports = getBarcodeCompleteHistorySchema;

