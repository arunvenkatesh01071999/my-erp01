const itemServices = require("../services/itemServices");

function putItemDiscountHandler(fastify) {
  const putItemDiscount = itemServices.putItemDiscountService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putItemDiscount({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putItemDiscountHandler;
