const outletRepo = require("../repository/outlets");

function postOutletService(fastify) {
  const { postOutlet } = outletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postOutlet.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putOutletService(fastify) {
  const { putOutlet } = outletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { outlet_id } = params;
    const promise1 = putOutlet.call(knex, {
      outlet_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteOutletService(fastify) {
  const { deleteOutlet } = outletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { outlet_id } = params;
    const promise1 = deleteOutlet.call(knex, {
      outlet_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletService(fastify) {
  const { getOutlet } = outletRepo(fastify);

  return async ({ params, body, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOutlet.call(knex, {
      params,
      body,
      logTrace,
      queryString: query
    });
    return response;
  };
}

function getOutletInfoService(fastify) {
  const { getOutletInfo } = outletRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletInfo.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}

function getOutletListService(fastify) {
  const { getOutletList } = outletRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletList.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}

function getOutletistByIdService(fastify) {
  const { getOutletListByIdRepo } = outletRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletListByIdRepo.call(knex, {
      body, params, logTrace,
      queryString: query,
      userDetails
    });
    return response;
  };
}

function getOutletCityWiseService(fastify) {
  const { getOutletCityWise } = outletRepo(fastify);

  return async ({ params, body, logTrace, query }) => {


    const knex = fastify.knexMedical;

    // Raw rows from DB
    const rows = await getOutletCityWise.call(knex, { params, body, logTrace, queryString: query, });

    // Shape them to match `getOutletCityWiseSchema`
    return buildCityWisePayload(rows);
  };
}

function buildCityWisePayload(rows = []) {
  const byCity = new Map();

  rows.forEach(r => {
    if (!byCity.has(r.city_id)) {
      byCity.set(r.city_id, {
        city_id: r.city_id,
        city_name: r.city_name,
        outlets: []
      });
    }

    byCity.get(r.city_id).outlets.push({
      id: r.id,
      code: r.code,
      short_name: r.short_name,
      fullname: r.fullname,
      is_active: r.is_active,
      bankid: r.bankid
    });
  });

  return Array.from(byCity.values());
}

function getOutletListBySupplierService(fastify) {
  const { getOutletListBySupplierRepo } = outletRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletListBySupplierRepo.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}

function getRegionwiseOutletListService(fastify) {
  const { getRegionwiseOutletListRepo } = outletRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getRegionwiseOutletListRepo.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}



function getPurchaseOrderRegionwiseOutletListService(fastify) {
  const { getPurchaseOrderRegionwiseOutletListRepo } = outletRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseOrderRegionwiseOutletListRepo.call(knex, {
      params,
      body,
      logTrace
    });
    return response;
  };
}


module.exports = {
  postOutletService,
  putOutletService,
  deleteOutletService,
  getOutletService,
  getOutletInfoService,
  getOutletListService,
  getOutletistByIdService,
  getOutletCityWiseService,
  getOutletListBySupplierService,
  getRegionwiseOutletListService,
  getPurchaseOrderRegionwiseOutletListService
};
