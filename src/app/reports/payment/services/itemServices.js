const paymentRepo = require("../repository/payment");



function postpaymentService(fastify) {
  const { getPaymentReport } = paymentRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPaymentReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}




module.exports = {

  postpaymentService
};
