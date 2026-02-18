const wareHouseRepo = require("../repository/wareHouse");
const { queryString } = require("../schemas/getWareHousePaginateSchema");

function getWareHouseService(fastify) {
  const { getWareHouse } = wareHouseRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getWareHouse.call(knex, {
      logTrace
    });
    return response;
  };
}

function getWareHousePaginateService(fastify) {
  const { getWareHousePaginate } = wareHouseRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getWareHousePaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };
}

function postWareHouseService(fastify) {
  const { postWareHouse } = wareHouseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postWareHouse.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putWareHouseService(fastify) {
  const { putWareHouse } = wareHouseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putWareHouse.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteWareHouseService(fastify) {
  const { deleteWareHouse } = wareHouseRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteWareHouse.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getWareHouseInfoService(fastify) {
  const { getWareHouseInfo } = wareHouseRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getWareHouseInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getCompanyDetailsByIdService(fastify) {
  const { getCompanyDetailsByIdRepo } = wareHouseRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getCompanyDetailsByIdRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;
  };
}

function getWarehouseListByIdService(fastify) {
  const { getWarehouseListByIdRepo } = wareHouseRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getWarehouseListByIdRepo.call(knex, {
      body, params, logTrace,
      queryString: query,
      userDetails
    });
    return response;
  };
}

function getWarehouseCityWiseService(fastify) {
  const { getWarehouseCityWise } = wareHouseRepo(fastify);

  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;

    // Raw rows from DB
    const rows = await getWarehouseCityWise.call(knex, { params, body, logTrace });
    console.log("rows", rows)
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
        warehouse: []
      });
    }

    byCity.get(r.city_id).warehouse.push({
      id: r.id,
      warehouse_name: r.warehouse_name,
      is_active: r.is_active
    });
  });

  return Array.from(byCity.values());
}


function getRegionService(fastify) {
  const { getRegionRepo } = wareHouseRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getRegionRepo.call(knex, {
      body, params, logTrace,
      queryString: query,
      userDetails
    });
    return response;
  };
}

function getWarehouseProductService(fastify) {
  const { getWarehouseProductRepo } = wareHouseRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getWarehouseProductRepo.call(knex, {
      body, params, logTrace,
      queryString: query,
      userDetails
    });
    return response;
  };
}

module.exports = {
  getWareHouseService,
  getWareHousePaginateService,
  postWareHouseService,
  putWareHouseService,
  deleteWareHouseService,
  getWareHouseInfoService,
  getCompanyDetailsByIdService,
  getWarehouseListByIdService,
  getWarehouseCityWiseService,
  getRegionService,
  getWarehouseProductService

};
