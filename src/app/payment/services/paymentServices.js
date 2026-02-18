const paymentRepo = require("../repository/payment");




function postpaymentService(fastify) {
  const { postpayment } = paymentRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postpayment.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });

    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getByPartyIdService(fastify) {
  const { getPurchaseMasterByPartyID } = paymentRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseMasterByPartyID.call(knex, {
      params,
      logTrace
    });
    const transformedResponse = response.map(row => ({
      ...row,
      paid: row.outstanding,
      outstanding: row.amount - row.outstanding,

    }));

    return transformedResponse;
    // return response;
  };
}

function getPaymentDocnoService(fastify) {
  const { getPaymentDocno } = paymentRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPaymentDocno.call(knex, {
      params,
      logTrace
    });

    return response;
  };
}

module.exports = {

  postpaymentService,
  getByPartyIdService,
  getPaymentDocnoService
};
