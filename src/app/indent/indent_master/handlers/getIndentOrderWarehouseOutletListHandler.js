const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderWarehouseOutletListHandler(fastify) {
    const getIndentOrderWarehouseOutletList = indentOrderServices.getIndentOrderWarehouseOutletListService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getIndentOrderWarehouseOutletList({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getIndentOrderWarehouseOutletListHandler;
