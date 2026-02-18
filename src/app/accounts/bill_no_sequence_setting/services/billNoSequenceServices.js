const getBillNoSequenceRepo = require("../repository/billNoSequenceRepo");

function postBillNoSequenceService(fastify) {
  const { postBillNoSequence } = getBillNoSequenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postBillNoSequence.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putBillNoSequenceService(fastify) {
  const { putBillNoSequence } = getBillNoSequenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
   
    const promise1 = putBillNoSequence.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteBillNoSequenceService(fastify) {
  const { deleteBillNoSequence } = getBillNoSequenceRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deleteBillNoSequence.call(knex, {
      id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getBillNoSequenceService(fastify) {
  const { getBillNoSequence } = getBillNoSequenceRepo(fastify);

  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getBillNoSequence.call(knex, {
      params,
      body,
      query,
      logTrace
    });
    return response;
  };
}


module.exports = {
  postBillNoSequenceService,
  putBillNoSequenceService,
  deleteBillNoSequenceService,
  getBillNoSequenceService
};
