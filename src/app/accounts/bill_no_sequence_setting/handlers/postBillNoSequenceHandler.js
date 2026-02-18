const getBillNoSequenceServices = require("../services/billNoSequenceServices.js");

function postBillNoSequenceHandler(fastify) {
  const postBillNoSequence = getBillNoSequenceServices.postBillNoSequenceService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postBillNoSequence({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postBillNoSequenceHandler;
