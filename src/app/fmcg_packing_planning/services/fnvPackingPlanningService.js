const fmcgPackingPlanningRepo = require("../repository/fmcgPackingPlanningRepo");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};


function listGrnByProductByParentIdService(fastify) {
  const { getGrnForParentProduct } = fmcgPackingPlanningRepo(fastify);

  return async ({ params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getGrnForParentProduct.call(knex, {
      params,
      logTrace,
      queryString: query
    });
    return response;
  };
}



function getAllBulkParentItemService(fastify) {
  const { getAllBulkParentItem } = fmcgPackingPlanningRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getAllBulkParentItem.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;
  };
}

function listChildItemByParentIdService(fastify) {
  const { getChildItemByParentId } = fmcgPackingPlanningRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getChildItemByParentId.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getAllPackingPlanningService(fastify) {
  const { getAllPackingPlanning } = fmcgPackingPlanningRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getAllPackingPlanning.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;
  };
}

function postPackingPlanningService(fastify) {
  const { postPackingPlanning } = fmcgPackingPlanningRepo(fastify);

  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const response = await postPackingPlanning.call(knex, {
      body,
      params,
      logTrace,
      userDetails,
      financialYear
    });

    return response;
  };
}

function updatePackingPlanningService(fastify) {
  const { updatePackingPlanning } = fmcgPackingPlanningRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const response = await updatePackingPlanning.call(knex, {
      body,
      params,
      logTrace,
      userDetails,
      financialYear
    });

    return response;
  };
}

function getPackingPlanningDocnoService(fastify) {
  const { getPackingPlanningDocno } = fmcgPackingPlanningRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const response = await getPackingPlanningDocno.call(knex, {
      body,
      params,
      logTrace,
      financialYear
    });
    return response;
  };
}

function getPackingPlanningByIdService(fastify) {
  const { getPackingPlanningById } = fmcgPackingPlanningRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    return await getPackingPlanningById.call(knex, {
      params,
      logTrace
    });
  };
}

module.exports = {
  getAllBulkParentItemService,
  listChildItemByParentIdService,
  postPackingPlanningService,
  updatePackingPlanningService,
  getPackingPlanningDocnoService,
  getAllPackingPlanningService,
  getPackingPlanningByIdService,
  listGrnByProductByParentIdService
};
