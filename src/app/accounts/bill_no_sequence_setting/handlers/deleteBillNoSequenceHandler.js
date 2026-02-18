const getBillNoSequenceServices = require("../services/billNoSequenceServices");

function deleteBillNoSequenceHandler(fastify) {
  const deleteBillNoSequence = getBillNoSequenceServices.deleteBillNoSequenceService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteBillNoSequence({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteBillNoSequenceHandler;
