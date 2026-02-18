const receiptServices = require("../services/receiptServices");

function postreceiptHandler(fastify) {
  const postreceipt = receiptServices.postreceiptService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postreceipt({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postreceiptHandler;
