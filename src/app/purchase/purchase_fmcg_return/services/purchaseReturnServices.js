const purchaseReturnRepo = require("../repository/purchasereturn");
const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function postPurchaseReturnService(fastify) {
  const { postPurchaseReturnRepo } = purchaseReturnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postPurchaseReturnRepo.call(knex, {
      params,
      body,
      logTrace,
      financialYear,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putPurchaseReturnService(fastify) {
  const { putPurchaseReturnDetailsRepo } = purchaseReturnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putPurchaseReturnDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      financialYear,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deletePurchaseReturnService(fastify) {
  const { deletePurchaseReturnDetailsRepo } = purchaseReturnRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = deletePurchaseReturnDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      financialYear,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseReturnService(fastify) {
  const { getPurchaseReturnRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}

function getPurchaseReturnEditListService(fastify) {
  const { getPurchaseReturnEditListRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnEditListRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}

function getPurchaseReturnByIdService(fastify) {
  const { getPurchaseReturnByIdRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnByIdRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}

function getPurchaseNoDetailsService(fastify) {
  const { getPurchaseNoDetailsRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseNoDetailsRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}

function getPurchaseReturnDocNoService(fastify) {
  const { generatePurchaseReturnNo } = purchaseReturnRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const response = await generatePurchaseReturnNo.call(knex, {
      logTrace,
      financialYear
    });
    return response;

  };
}

function getPurchaseReturnBySupplierService(fastify) {
  const { getProductDetailsBySupplierRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getProductDetailsBySupplierRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}

function getPurchaseReturnListService(fastify) {
  const { getPurchaseReturnListRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnListRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}

function getPurchaseBillwiseDetailsService(fastify) {
  const { getPurchaseReturnBillwiseRepo } = purchaseReturnRepo(fastify);
  return async ({ body, params, query, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnBillwiseRepo.call(knex, {
      body,
      params,
      queryString: query,
      logTrace
    });
    return response;

  };
}


function getPurchaseReturnByDocNoService(fastify) {
  const { getPurchaseReturnByDocNo, getPurchaseReturnByBillNo } = purchaseReturnRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnByDocNo.call(knex, {
      params,
      logTrace
    });


    const transformedResponse = await Promise.all(
      response.map(async row => {
        let prod_id = row.prodid;
        let billno = params.docno;
        const retInfo = await getPurchaseReturnByBillNo.call(knex, { prod_id, billno, logTrace });

        return {
          ...row,
          qty: row.qty - retInfo.prqty,
          original_qty: row.qty
        };
      })
    );

    // const transformedResponse = response.map(row => ({
    //   ...row,
    //   docno: row.prodid,
    //   qty: row.qty - row.prqty,
    //   original_qty: row.qty

    // }));

    return transformedResponse;
  };
}


function getPurchaseDocNoService(fastify) {
  const { getPurchaseMaster } = purchaseReturnRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseMaster.call(knex, {
      logTrace
    });
    return response;

  };
}




function getPurchaseReturnGetAllService(fastify) {
  const { getPurchaseReturnGetAllMaster } = purchaseReturnRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getPurchaseReturnGetAllMaster.call(knex, {
      body,
      params,
      logTrace
    });
    return response;

  };
}

module.exports = {
  postPurchaseReturnService,
  putPurchaseReturnService,
  deletePurchaseReturnService,
  getPurchaseReturnService,
  getPurchaseReturnEditListService,
  getPurchaseReturnByDocNoService,
  getPurchaseDocNoService,
  getPurchaseReturnDocNoService,
  getPurchaseReturnGetAllService,
  getPurchaseReturnBySupplierService,
  getPurchaseReturnListService,
  getPurchaseBillwiseDetailsService,
  getPurchaseNoDetailsService,
  getPurchaseReturnByIdService
};
