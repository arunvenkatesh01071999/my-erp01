const itemServices = require("../services/itemServices");

function getOutletProductOrderDaysHandler(fastify) {
  const getOutletProductOrderDays = itemServices.getOutletProductOrderDaysService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOutletProductOrderDays({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletProductOrderDaysHandler;
