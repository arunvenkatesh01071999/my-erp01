const getWarehouseExpenseServices = require("../services/getWarehouseExpenseServices");

function deleteWarehouseExpenseHandler(fastify) {
    const  deleteWarehouseExpense = getWarehouseExpenseServices.deleteWarehouseExpenseService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await  deleteWarehouseExpense({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = deleteWarehouseExpenseHandler;
