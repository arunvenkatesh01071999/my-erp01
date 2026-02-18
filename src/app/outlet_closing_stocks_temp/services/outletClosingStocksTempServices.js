const outletClosingsStockRepo = require("../repository/outletClosingStocksTempRepo");

function postOutletClosingStocksTempService(fastify) {
  const { postOutletClosingStocksTempRepo } = outletClosingsStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postOutletClosingStocksTempRepo.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletClosingStocksTempService(fastify) {
  const { getOutletClosingStocksTempRepo } = outletClosingsStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletClosingStocksTempRepo.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function deleteOutletClosingStocksTempService(fastify) {
  const { deleteOutletClosingStocksTempRepo } = outletClosingsStockRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteOutletClosingStocksTempRepo.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
module.exports = {
  postOutletClosingStocksTempService,
  getOutletClosingStocksTempService,
  deleteOutletClosingStocksTempService
  
};
