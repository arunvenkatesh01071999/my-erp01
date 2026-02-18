const getSalesService = require("../services/getOutletSalesServices");

function allOutletsSalesHandler(fastify) {
    const getallOutletsSales = getSalesService.getallOutletsSalesService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getallOutletsSales({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = allOutletsSalesHandler;
