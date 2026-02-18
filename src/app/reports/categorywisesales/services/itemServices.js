const itemRepo = require("../repository/item.js");

function getCategoryWisePaginateService(fastify) {
  const { getCatgoryWiseSales } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getCatgoryWiseSales.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getCategoryWisePaginateService
};
