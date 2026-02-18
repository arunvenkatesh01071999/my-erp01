const indentOrderRepo = require("../repository/indentOrderRepo.js");




function postIndentOrderProductService(fastify) {
  const { postIndentOrderProduct } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = postIndentOrderProduct.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getIndentOrderProductIndentNoService(fastify) {
  const { getIndentOrderProductIndentNo } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderProductIndentNo.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getIndentOrderProductMinStockService(fastify) {
  const { getIndentOrderProductMinStock } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderProductMinStock.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getIndentOrderProductDetailsService(fastify) {
  const { getIndentOrderProductDetails } = indentOrderRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderProductDetails.call(knex, {
      params,
      body,
      query,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getIndentOrderProductDetailsAllService(fastify) {
  const { getIndentOrderProductDetailsAll } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderProductDetailsAll.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getIndentOrderProductSalesBasedService(fastify) {
  const { getIndentOrderProductSalesBased } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderProductSalesBased.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getIndentOrderWarehouseOutletListService(fastify) {
  const { getIndentOrderWarehouseOutletList } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderWarehouseOutletList.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getIndentOrderOutletWarehouseListService(fastify) {
  const { getIndentOrderOutletWarehouseList } = indentOrderRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderOutletWarehouseList.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getIndentOrderDetailsService(fastify) {
  const { getIndentOrderDetails } = indentOrderRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentOrderDetails.call(knex, {
      params,
      body,
      query,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getItemIndentOrderDetailsService(fastify) {
  const { getItemForIndentorder } = indentOrderRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getItemForIndentorder.call(knex, {
      params,
      body,
      query,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getIndentDetailsService(fastify) {
  const { getIndentDetails } = indentOrderRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getIndentDetails.call(knex, {
      params,
      body,
      query,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


module.exports = {
  postIndentOrderProductService,
  getIndentOrderProductIndentNoService,
  getIndentOrderProductMinStockService,
  getIndentOrderProductDetailsService,
  getIndentOrderProductDetailsAllService,
  getIndentOrderProductSalesBasedService,
  getIndentOrderWarehouseOutletListService,
  getIndentOrderOutletWarehouseListService,
  getIndentOrderDetailsService,
  getItemIndentOrderDetailsService,
  getIndentDetailsService
};
