const closingCashRepo = require("../repository/closingCash.js");
const email = require("../../../notification/repository/email");

function getclosingCashReportService(fastify) {
  const { getclosingCashReport } = closingCashRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getclosingCashReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getOneClosingCashReportService(fastify) {
  const { getOneClosingCashReport } = closingCashRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOneClosingCashReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function closingCashEmailService(fastify) {
  const { closingCashEmail } = closingCashRepo(fastify);
  const { sendEmailNotification } = email(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await closingCashEmail.call(knex, {
      body,
      params,
      logTrace
    });

    if (response.length > 0) {

      await sendEmailNotification(response);

    }
    // return response;
  };
}

module.exports = {
  getclosingCashReportService,
  closingCashEmailService,
  getOneClosingCashReportService
};
