const salesMasterServices = require("../services/salesMasterServices");

function generateSaleNoHandler(fastify) {
  const generateSaleNo = salesMasterServices.generateSaleNoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await generateSaleNo({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = generateSaleNoHandler;
