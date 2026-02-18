const postOutletExpencesReportServices = require("../services/postOutletExpencesReportServices");

function postOutletExpencesReportHandler(fastify) {
  const postOutletExpencesReport = postOutletExpencesReportServices.postOutletExpencesReportService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await postOutletExpencesReport({
      params,
      body,
      logTrace,
      userDetails,
      query

    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletExpencesReportHandler;
