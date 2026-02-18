const outletServices = require("../services/outletServices");

function getOutletListHandler(fastify) {
  const getOutletList = outletServices.getOutletListService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletList({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletListHandler;
