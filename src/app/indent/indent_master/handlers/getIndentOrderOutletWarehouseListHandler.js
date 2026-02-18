const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderOutletWarehouseListHandler(fastify) {
    const getIndentOrderOutletWarehouseList = indentOrderServices.getIndentOrderOutletWarehouseListService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getIndentOrderOutletWarehouseList({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getIndentOrderOutletWarehouseListHandler;
