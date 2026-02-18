const getOutletSalesEditLogRepo = require("../repository/getOutletSalesEditLogRepo");



function postOutletSalesEditLogService(fastify) {
  const { postOutletSalesEditLog } = getOutletSalesEditLogRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postOutletSalesEditLog.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postOutletSalesEditLogService
};
