const OfferMasterRepo = require("../repository/schemeMaster");


function getOfferMasterPaginateService(fastify) {
  const { getOfferMasterPaginate } = OfferMasterRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferMasterPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    // Transform cat_id string -> cat_ids array
    if (response?.data?.length) {
      response.data = response.data.map(item => {
        let catIds = [];
        let pids = [];
        if (item.cat_id && item.cat_id.trim() !== "") {
          catIds = item.cat_id.split(",").map(Number); // convert to array of numbers
        }
        if (item.pid && item.pid.trim() !== "") {
          pids = item.pid.split(",").map(Number); // convert to array of numbers
        }
        return {
          ...item,
          cat_ids: catIds,
          pid: pids
        };
      });
    }
    return response;
  };
}
function postOfferMasterService(fastify) {
  const { postOfferMaster } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postOfferMaster.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putOfferMasterService(fastify) {
  const { putOfferMaster } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { sid } = params;
    const promise1 = putOfferMaster.call(knex, {
      sid,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteOfferMasterService(fastify) {
  const { deleteOfferMaster } = OfferMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { sid } = params;
    const promise1 = deleteOfferMaster.call(knex, {
      sid,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getOfferMasterInfoService(fastify) {
  const { getOfferMasterInfo } = OfferMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOfferMasterInfo.call(knex, {
      params,
      logTrace
    });
    // Transform cat_id string -> cat_ids array 
    let catIds = [];
    let pids = [];
    if (response.cat_id && response.cat_id.trim() !== "") {
      catIds = response.cat_id.split(",").map(Number); // convert to array of numbers
    }
    if (response.pid && response.pid.trim() !== "") {
      pids = response.pid.split(",").map(Number); // convert to array of numbers
    }
    return {
      ...response,
      cat_ids: catIds,
      pid: pids
    };

  };
}
function getSchemeTypeService(fastify) {

  return async ({ params, logTrace }) => {
    const response = [
      {
        id: 0,
        scheme_type: "Bill Value"
      },
      {
        id: 1,
        scheme_type: "Item"
      },
      {
        id: 2,
        scheme_type: "Category"
      },
      {
        id: 3,
        scheme_type: "Brand"
      },
    ]
    return response;
  };
}

module.exports = {
  postOfferMasterService,
  putOfferMasterService,
  deleteOfferMasterService,
  getOfferMasterInfoService,
  getOfferMasterPaginateService,
  getSchemeTypeService
};
