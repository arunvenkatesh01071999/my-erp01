const outletExpencesRepo = require("../repository/outletExpences");



function postOutletExpencesReportService(fastify) {
  const { getOutletExpencesReport } = outletExpencesRepo(fastify);

  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletExpencesReport.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      queryString: query
    });
    return response;
  };
}




module.exports = {

  postOutletExpencesReportService
};
