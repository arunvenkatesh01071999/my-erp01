const fnvPackingPlanningRepo = require("../repository/fnvPackingPlanningRepo");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formatYear = (year) => year.toString().slice(-2);

  if (month >= 4) {

    return `${formatYear(year)}_${formatYear(year + 1)}`;
  } else {

    return `${formatYear(year - 1)}_${formatYear(year)}`;
  }
}

function getAllBulkParentItemService(fastify) {
  const { getAllBulkParentItem } = fnvPackingPlanningRepo(fastify);

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
  const { getChildItemByParentId } = fnvPackingPlanningRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const parentId = params.parent_id;
    const response = await getChildItemByParentId.call(knex, {
      parentId,
      logTrace
    });
    return response;
  };
}

function getAllPackingPlanningService(fastify) {
  const { getAllPackingPlanning } = fnvPackingPlanningRepo(fastify);

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
  const { postPackingPlanning } = fnvPackingPlanningRepo(fastify);

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
  const { updatePackingPlanning } = fnvPackingPlanningRepo(fastify);
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
  const { getPackingPlanningDocno } = fnvPackingPlanningRepo(fastify);

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
  const { getPackingPlanningById } = fnvPackingPlanningRepo(fastify);

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
  getPackingPlanningByIdService
};
