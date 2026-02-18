const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function putOutletPomasterGrndetailsHandler(fastify) {

    const putOutletPomasterGrndetails = outletPurchaseOrderServices.putOutletPomasterGrndetailsServices(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await putOutletPomasterGrndetails({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putOutletPomasterGrndetailsHandler;
