const getOutletSalesMasterRepo = require("../repository/getOutletSalesMasterRepo");
const whatsapp = require("../../../notification/repository/whatsappsales");



function postOutletSalesMasterService(fastify) {
  const { postOutletSalesMaster } = getOutletSalesMasterRepo(fastify);
  const { sendThanksSales } = whatsapp(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const financialYear = getFinancialYear();
    const promise1 = postOutletSalesMaster.call(knex, {
      params,
      body,
      logTrace, userDetails, financialYear
    });
    const [response] = await Promise.all([promise1]);
    // if (response.success == true) {
    //   let bill_number = response.docno;
    //   let parts = bill_number.split(financialYear);
    //   let modifiedString1 = parts.map((part, index) => {
    //     return part.replace(/_/g, '/');
    //   }).join(financialYear);
    //   let phone_number = body.mobile;
    //   if (phone_number.length === 10) {
    //     phone_number = "91" + phone_number;
    //   }
    //   if (phone_number.length === 10 || phone_number.length === 12) {
    //     const result = sendThanksSales(modifiedString1, phone_number);
    //   }

    // }
    return response;
  };
}


function putOutletSalesPaymentService(fastify) {
  const { putOutletSalesPayment } = getOutletSalesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    // const financialYear = getFinancialYear();
    const promise1 = putOutletSalesPayment.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletSalesMasterService(fastify) {
  const { getOutletSalesMaster } = getOutletSalesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletSalesMaster.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletSalesDocNoService(fastify) {
  const { getOutletSalesDocNo } = getOutletSalesMasterRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;

    const financialYear = getFinancialYear();

    const response = await getOutletSalesDocNo.call(knex, {
      params,
      logTrace,
      financialYear
    });
    return response;

  };
}


const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formatYear = (year) => year.toString().slice(-2);

  if (month >= 4) {

    return `${formatYear(year)}_${formatYear(year + 1)}`;
  } else {

    return `${formatYear(year - 1)}_${formatYear(year)}`;
  }
};

function getAllOutletSalesDocNoService(fastify) {
  const { getAllOutletSalesDocNo } = getOutletSalesMasterRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getAllOutletSalesDocNo.call(knex, {
      body,
      params,
      logTrace
    });
    return response;

  };
}


function getFetchOutletMembersService(fastify) {
  const { getFetchOutletMembers } = getOutletSalesMasterRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getFetchOutletMembers.call(knex, {
      body,
      params,
      logTrace
    });
    return response;

  };
}
function deleteOutletSalesService(fastify) {
  const { deleteOutletSales } = getOutletSalesMasterRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteOutletSales.call(knex, {
      params, body, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  postOutletSalesMasterService,
  getOutletSalesMasterService,
  getOutletSalesDocNoService,
  getAllOutletSalesDocNoService,
  getFetchOutletMembersService,
  getFinancialYear,
  putOutletSalesPaymentService,
  deleteOutletSalesService
};
