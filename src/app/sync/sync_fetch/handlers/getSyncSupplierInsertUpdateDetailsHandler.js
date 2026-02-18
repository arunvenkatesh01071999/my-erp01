const syncfetchService = require("../services/syncfetchService");


function getSyncSupplierInsertUpdateDetailsHandler(fastify) {
    const getSyncSupplierInsertUpdateDetails = syncfetchService.getSyncSupplierInsertUpdateDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getSyncSupplierInsertUpdateDetails({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getSyncSupplierInsertUpdateDetailsHandler;
