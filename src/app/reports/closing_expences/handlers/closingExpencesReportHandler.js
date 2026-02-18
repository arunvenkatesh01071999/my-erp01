const closingExpencesServices = require("../services/closingExpencesServices.js");

function closingExpencesReportHandler(fastify) {
  const getclosingExpencesReport = closingExpencesServices.getclosingExpencesReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getclosingExpencesReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = closingExpencesReportHandler;
