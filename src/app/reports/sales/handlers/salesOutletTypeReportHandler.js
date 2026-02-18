const salesServices = require("../services/salesServices");

function salesOutletTypeReportProdidHandler(fastify) {
    const getSalesOutletType = salesServices.getSalesOutletTypeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesOutletType({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = salesOutletTypeReportProdidHandler;
