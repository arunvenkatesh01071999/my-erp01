const getBillNoSequenceServices = require("../services/billNoSequenceServices");

function putBillNoSequenceHandler(fastify) {
  const putBillNoSequence = getBillNoSequenceServices.putBillNoSequenceService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putBillNoSequence({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putBillNoSequenceHandler;
