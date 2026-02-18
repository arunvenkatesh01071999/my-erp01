const PackingEmployeeServices = require("../services/PackingEmployeeServices");

function getPackingEmployeePaginateHandler(fastify) {
  const getPackingEmployeePaginate = PackingEmployeeServices.getPackingEmployeePaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getPackingEmployeePaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingEmployeePaginateHandler;
