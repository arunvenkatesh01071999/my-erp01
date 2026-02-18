const getClosingCashWarehouseMstServices = require("../services/getClosingCashWarehouseMstServices.js");

function postClosingCashWarehouseMstHandler(fastify) {
  const postClosingCashWarehouseMst = getClosingCashWarehouseMstServices.postClosingCashWarehouseMstService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingCashWarehouseMst({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingCashWarehouseMstHandler;
