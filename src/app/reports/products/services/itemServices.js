const itemRepo = require("../repository/item.js");

function getItemPaginateService(fastify) {
  const { getItemPaginate } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemPaginate.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getStockValueService(fastify) {
  const { getStockValue } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getStockValue.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getItemPaginateService,
  getStockValueService
};
