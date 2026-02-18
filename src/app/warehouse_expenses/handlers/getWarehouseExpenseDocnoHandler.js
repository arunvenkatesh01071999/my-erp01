const getWarehouseExpenseServices = require("../services/getWarehouseExpenseServices");

function getWarehouseExpenseDocnoHandler(fastify) {
    const getWarehouseExpenseDocno = getWarehouseExpenseServices.getWarehouseExpenseDocnoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getWarehouseExpenseDocno({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getWarehouseExpenseDocnoHandler;
