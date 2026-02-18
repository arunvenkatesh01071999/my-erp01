const expenceServices = require("../services/expenceServices");

function postExpences(fastify) {
  const postExpence = expenceServices.postExpenceService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postExpence({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postExpences;
