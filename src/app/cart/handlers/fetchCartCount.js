const fetchCartCountService = require("../services/fetchCartCount");

function fetchCartCountHandler(fastify) {
  const fetchCartCount = fetchCartCountService(fastify);

  return async (request, reply) => {
    const { query, body, logTrace, userDetails } = request;

    const response = await fetchCartCount({
      query,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = fetchCartCountHandler;
