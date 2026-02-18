const getWarehouseExpenseServices = require("../services/getWarehouseExpenseServices");

function postWarehouseExpenseHandler(fastify) {
    const postWarehouseExpense = getWarehouseExpenseServices.postWarehouseExpenseService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postWarehouseExpense({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = postWarehouseExpenseHandler;
