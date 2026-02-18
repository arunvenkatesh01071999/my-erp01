const closingCashWarehouseServices = require("../services/closingCashWarehouseServices.js");

function closingCashWarehouseReportHandler(fastify) {
  const getClosingCashWarehouseReport = closingCashWarehouseServices.getClosingCashWarehouseReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getClosingCashWarehouseReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = closingCashWarehouseReportHandler;
