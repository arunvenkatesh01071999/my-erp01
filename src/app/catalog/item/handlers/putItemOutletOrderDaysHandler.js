const itemServices = require("../services/itemServices");

function putItemOutletOrderDaysHandler(fastify) {
  const putItemOutletOrderDays = itemServices.putItemOutletOrderDaysService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putItemOutletOrderDays({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putItemOutletOrderDaysHandler;
