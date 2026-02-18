const expenceServices = require("../services/expenceServices");

function postOutletExpences(fastify) {
  const postExpence = expenceServices.postOutletExpenceService(fastify);

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

module.exports = postOutletExpences;
