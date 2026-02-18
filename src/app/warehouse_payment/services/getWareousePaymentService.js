const getWareousePaymentRepo = require("../repository/getWareousePaymentRepo");



function postWareousePaymentService(fastify) {
  const { postWarehousePaymentRepo } = getWareousePaymentRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postWarehousePaymentRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



function getWareousePaymentOutstandingBillSupplierlistService(fastify) {
  const { getWareousePaymentOutstandingBillSupplierlistRepo } = getWareousePaymentRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getWareousePaymentOutstandingBillSupplierlistRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getWareousePaymentOutstandingBillListService(fastify) {
  const { getWareousePaymentOutstandingBillListRepo } = getWareousePaymentRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getWareousePaymentOutstandingBillListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getWareousePaymentOutstandingBillSupplierlDetailsService(fastify) {
  const { getWareousePaymentOutstandingBillSupplierlDetailsRepo } = getWareousePaymentRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getWareousePaymentOutstandingBillSupplierlDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
module.exports = {
  postWareousePaymentService,
  getWareousePaymentOutstandingBillSupplierlistService,
  getWareousePaymentOutstandingBillListService,
  getWareousePaymentOutstandingBillSupplierlDetailsService
};

