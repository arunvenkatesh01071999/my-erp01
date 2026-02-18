const salesServices = require("../services/salesServices");

function salesReportHandler(fastify) {
  const getSalesReport = salesServices.expenceLedgerService(fastify);
  return async (request, reply) => {
    const { params, logTrace, page_size, current_page } = request;
    const response = await getSalesReport({ params, logTrace, page_size, current_page });
    return reply.code(200).send(response);
  };
}

module.exports = salesReportHandler;
