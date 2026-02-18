const itemRepo = require("../repository/item.js");



function getSubWarehouseStocksService(fastify) {
  const { getSubWarehouseStocks } = itemRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSubWarehouseStocks.call(knex, {
      body, params, logTrace
    });
    return response;

  };
}

function getWarehouseMappingListService(fastify) {
  const { getWarehouseMappingListRepo } = itemRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getWarehouseMappingListRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace,
      userDetails
    });
    return response;

  };
}


function getItemDetailsOutletsSalesProductService(fastify) {
  const { getItemDetailsOutletsSalesProduct } = itemRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemDetailsOutletsSalesProduct.call(knex, {
      body, params, logTrace
    });
    return {
      ...response,
      is_floating: response.uom_name === 'Kg' ? true : false
    };
  };
}
function getItemOutletService(fastify) {
  const { getItemOutlet } = itemRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemOutlet.call(knex, {
      body, params, logTrace
    });
    return response;

  };
}

function getItemService(fastify) {
  const { getItem } = itemRepo(fastify);

  return async ({ logTrace, query, params }) => {
    const knex = fastify.knexMedical;
    const response = await getItem.call(knex, {
      logTrace,
      queryparams: query,
      params
    });
    return response;

  };
}

function getItemDetailsExportService(fastify) {
  const { getItemExportRepo } = itemRepo(fastify);

  return async ({ logTrace, query, params }) => {
    const knex = fastify.knexMedical;
    console.log(query, "query")
    const response = await getItemExportRepo.call(knex, {
      logTrace,
      queryString: query,
      params
    });
    return response;

  };
}


function postItemDetailsImportService(fastify) {
  const { postItemImportRepo } = itemRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await postItemImportRepo.call(knex, {
      body,
      params,
      logTrace,
      query,
      userDetails
    });
    return response;
  };
}

function postItemImportValidationService(fastify) {
  const { postItemExcelValidation } = itemRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await postItemExcelValidation.call(knex, {
      body,
      params,
      logTrace,
      query,
      userDetails
    });
    return response;
  };
}

function getItemPurchaseProductService(fastify) {
  const { getItemPurchaseProduct } = itemRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemPurchaseProduct.call(knex, {
      logTrace
    });
    return response;

  };
}
function getItemPaginateService(fastify) {
  const { getItemPaginate } = itemRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getItemPaginate.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;
  };

}

function getItemParentService(fastify) {
  const { getItemParentList } = itemRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getItemParentList.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}


function postItemService(fastify) {
  const { postItem } = itemRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postItem.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putItemService(fastify) {
  const { putItem } = itemRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    // console.log(id, "id");
    const promise1 = putItem.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putItemActiveStatusService(fastify) {
  const { putItemActiveStatusRepo } = itemRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putItemActiveStatusRepo.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putItemDiscountService(fastify) {
  const { putItemDiscount } = itemRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putItemDiscount.call(knex, {

      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteItemService(fastify) {
  const { deleteItem } = itemRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { id } = params;
    const promise1 = deleteItem.call(knex, {
      id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getItemInfoService(fastify) {
  const { getItemInfo } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getItemInfoWithProcodeService(fastify) {
  const { getItemInfoWithProcode } = itemRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemInfoWithProcode.call(knex, {
      body, params, logTrace
    });
    return response;
  };
}

function getItemCodeService(fastify) {
  const { getItemCodeInfo } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemCodeInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}
function getOutletProductOrderDaysService(fastify) {
  const { getOutletProductOrderDaysRepo } = itemRepo(fastify);

  return async ({ params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletProductOrderDaysRepo.call(knex, {
      params,
      queryString: query,
      logTrace
    });
    return response;
  };
}


function getItemSearchService(fastify) {
  const { itemSearch } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await itemSearch.call(knex, {
      params,
      logTrace
    });
    return response;
  };

}

function getItemImportStatusService(fastify) {
  const { getItemImportStatusRepo } = itemRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemImportStatusRepo.call(knex, {
      logTrace
    })

    return response;
  }

}

function getitemStatusService(fastify) {
  const { getItemStatusRepo } = itemRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemStatusRepo.call(knex, {
      logTrace
    })

    return response;
  }

}

function getBarcodeSearchService(fastify) {
  const { itemBarcodeSearch } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await itemBarcodeSearch.call(knex, {
      params,
      logTrace
    });

    return {
      ...response,
      is_floating: response.uom_name === 'Kg' ? true : false
    };
  };

}
function getBarcodeSearchClosingStockService(fastify) {
  const { getItemsSearchClosingStock } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getItemsSearchClosingStock.call(knex, {
      params,
      logTrace
    });
    response.is_floating = response.uom_name === 'Kg';
    return response;
  };

}

function getBarcodeIssueSearchService(fastify) {
  const { getBarcodeIssueSearch } = itemRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBarcodeIssueSearch.call(knex, {
      params,
      logTrace
    });
    return response;
  };

}

function putItemOutletOrderDaysService(fastify) {
  const { putItemOutletOrderDaysRepo } = itemRepo(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putItemOutletOrderDaysRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      fastify
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function skuPriceUploadService(fastify) {
  const { skuPriceUpload } = itemRepo(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = skuPriceUpload.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      fastify
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function skuPriceListService(fastify) {
  const { skuPriceList } = itemRepo(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = skuPriceList.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      fastify
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function updatePricePoService(fastify) {
  const { updatePricePoRepo } = itemRepo(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = updatePricePoRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      fastify
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  getItemService,
  postItemService,
  putItemService,
  deleteItemService,
  getItemInfoService,
  getItemPaginateService,
  putItemActiveStatusService,
  getItemCodeService,
  getItemSearchService,
  getItemImportStatusService,
  getitemStatusService,
  getBarcodeSearchService,
  getBarcodeSearchClosingStockService,
  getBarcodeIssueSearchService,
  getItemOutletService,
  getItemInfoWithProcodeService,
  putItemDiscountService,
  getItemPurchaseProductService,
  getItemDetailsOutletsSalesProductService,
  getSubWarehouseStocksService,
  getWarehouseMappingListService,
  getItemParentService,
  getItemDetailsExportService,
  postItemDetailsImportService,
  postItemImportValidationService,
  getOutletProductOrderDaysService,
  putItemOutletOrderDaysService,
  skuPriceUploadService,
  skuPriceListService,
  updatePricePoService
};
