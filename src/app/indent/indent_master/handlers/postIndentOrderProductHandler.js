const IndentOrderServices = require("../services/indentOrderServices.js");

function postIndentOrderProductHandler(fastify) {
  const postIndentOrderProduct = IndentOrderServices.postIndentOrderProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postIndentOrderProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postIndentOrderProductHandler;
