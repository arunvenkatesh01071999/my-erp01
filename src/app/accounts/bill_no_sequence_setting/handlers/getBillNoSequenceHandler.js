const getBillNoSequenceServices = require("../services/billNoSequenceServices");

function getBillNoSequenceHandler(fastify) {
  const getBillNoSequence = getBillNoSequenceServices.getBillNoSequenceService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getBillNoSequence({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getBillNoSequenceHandler;
