const supplierServices = require("../services/supplierService");

function uploadDocumentHandler(fastify) {
    const uploadDocument = supplierServices.uploadDocumentService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await uploadDocument({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = uploadDocumentHandler;
