const getOutletSalesReturnMasterRepo = require("../repository/getOutletSalesReturnMasterRepo");



function getOutletSalesReturnMasterGetallService(fastify) {
  const { getOutletSalesReturnGetallMaster } = getOutletSalesReturnMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletSalesReturnGetallMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



function getOutletSalesReturnMasterGetOneService(fastify) {
  const { getOutletSalesReturnGetOneMaster } = getOutletSalesReturnMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletSalesReturnGetOneMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postOutletSalesReturnMasterService(fastify) {
  const { postOutletSalesReturnMaster } = getOutletSalesReturnMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletSalesReturnMaster.call(knex, {
      params,
      financialYear,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function updateOsmBycashBillService(fastify) {
  const { updateOsmBycashBill } = getOutletSalesReturnMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = updateOsmBycashBill.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletSalesReturnDocNoService(fastify) {
  const { getOutletSalesReturnDocNo } = getOutletSalesReturnMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const response = await getOutletSalesReturnDocNo.call(knex, {
      params,
      logTrace,
      financialYear
    });
    return response;

  };
}
const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
  const year = date.getFullYear();

  const formatYear = (year) => year.toString().slice(-2); // Get last two digits of the year

  if (month >= 4) {
    // If the month is April or later, the financial year starts from this year
    return `${formatYear(year)}_${formatYear(year + 1)}`;
  } else {
    // If the month is January to March, the financial year starts from the previous year
    return `${formatYear(year - 1)}_${formatYear(year)}`;
  }
};

function getOutletSalesReturnServiceByOutletId(fastify) {
  const { getOutletSalesReturnByOutletId, getOutletSalesReturnByBillNo } = getOutletSalesReturnMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesReturnByOutletId.call(knex, {
      params,
      logTrace
    });


    const transformedResponse = await Promise.all(
      response.map(async row => {
        let prod_id = row.prodid;
        let billno = params.billno;

        const retInfo = await getOutletSalesReturnByBillNo.call(knex, { prod_id, billno, logTrace });
        return {

          ...row,
          qty: row.qty - retInfo.osaqty,
          original_qty: row.qty
        };
      })
    );

    return transformedResponse;
  };
}


function getOutletSalesDetailsService(fastify) {
  const { getOutletSalesDetails } = getOutletSalesReturnMasterRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesDetails.call(knex, {
      logTrace
    });
    return response;

  };
}

function getOutletSalesDetailsDocNoService(fastify) {
  const { getOutletSalesDocNo } = getOutletSalesReturnMasterRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSalesDocNo.call(knex, {
      body, params, logTrace
    });
    return response;

  };
}

module.exports = {
  postOutletSalesReturnMasterService,
  getOutletSalesReturnDocNoService,
  getOutletSalesReturnServiceByOutletId,
  getOutletSalesDetailsService,
  getOutletSalesDetailsDocNoService,
  getOutletSalesReturnMasterGetallService,
  getOutletSalesReturnMasterGetOneService,
  updateOsmBycashBillService
  // getOutletSalesReturnMasterService
};
