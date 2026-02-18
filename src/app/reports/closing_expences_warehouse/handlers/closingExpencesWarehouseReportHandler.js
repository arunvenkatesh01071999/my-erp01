const closingExpencesServices = require("../services/closingExpencesServices.js");

function closingExpencesWarehouseReportHandler(fastify) {
  const closingExpencesWarehouseReport = closingExpencesServices.closingExpencesWarehouseReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await closingExpencesWarehouseReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = closingExpencesWarehouseReportHandler;
