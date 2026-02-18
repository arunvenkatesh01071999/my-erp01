const OutletRepo = require("../../outlet_po/Outlet_po_manual/repository/OutletRepo");
const emailRepo = require("../../outlet_po/vendor_mail/repository/email");
const outletPurchaseRepo = require("../repository/outletPurchaseRepo");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function generateOutletPurchaseDocnoService(fastify) {
  const { generateOutletPurchaseDocnoRepo } = outletPurchaseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = generateOutletPurchaseDocnoRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletGrnByIdService(fastify) {
  const { getOutletGrnByIdRepo } = outletPurchaseRepo(fastify);
  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletGrnByIdRepo.call(knex, {
      params,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletPurchasePoListService(fastify) {
  const { getOutletPurchasePoListRepo } = outletPurchaseRepo(fastify);
  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchasePoListRepo.call(knex, {
      params,
      body,
      queryString: query,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletPurchaseItemListService(fastify) {
  const { getOutletPurchaseItemListRepo } = outletPurchaseRepo(fastify);
  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseItemListRepo.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletPurchaseSupplierListService(fastify) {
  const { getOutletPurchaseSupplierListRepo } = outletPurchaseRepo(fastify);
  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseSupplierListRepo.call(knex, {
      params,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}



// function postOutletPurchaseService(fastify) {
//   const { postOutletPurchaseRepo } = outletPurchaseRepo(fastify);
//   return async ({ body, logTrace, userDetails }) => {
//     const knex = fastify.knexMedical;
//     const financialYear = getFinancialYear();
//     const promise1 = postOutletPurchaseRepo.call(knex, {
//       body,
//       logTrace,
//       userDetails,
//       financialYear
//     });
//     const [response] = await Promise.all([promise1]);
//     return response;
//   };
// }

function postOutletPurchaseService(fastify) {
  const { postOutletPurchaseRepo } = outletPurchaseRepo(fastify);
  const { getOutletGrnVendorMailDetailsRepo } = OutletRepo(fastify);
  const { sendMailForGrn } = emailRepo(fastify);

  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();

    /* -------- STEP 1: Save Purchase -------- */

    const response = await postOutletPurchaseRepo.call(knex, {
      body,
      params,
      logTrace,
      userDetails,
      financialYear
    });

    console.log("MAIL DEBUG → response:", response);

    /* -------- STEP 2: Fetch Mail Details -------- */

    const grnList = await getOutletGrnVendorMailDetailsRepo.call(knex, {
      body: { ...body, docno: response.docno },
      logTrace
    });

    console.log("MAIL DEBUG → grnList:", grnList);

    if (!Array.isArray(grnList) || grnList.length === 0) {
      console.log("MAIL DEBUG → grnList empty");
      return response;
    }

    /* -------- STEP 3: Send Mail (Background) -------- */

    for (const grn of grnList) {
      console.log("MAIL DEBUG → grn item:", grn);

      const { docno, outlet_id, mailData } = grn;

      if (!docno || !outlet_id) {
        console.log("MAIL DEBUG → missing docno/outlet_id");
        continue;
      }

      console.log("MAIL DEBUG → calling sendMailForGrn");

      sendMailForGrn({ docno, outlet_id, mailData })
        .then(() => console.log("MAIL DEBUG → mail function executed"))
        .catch(err => console.error("MAIL DEBUG → mail error", err));
    }

    return response;
  };
}



function postOutletManualPurchaseService(fastify) {
  const { postOutletManualPurchaseRepo } = outletPurchaseRepo(fastify);
  return async ({ body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletManualPurchaseRepo.call(knex, {
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function updateOutletPurchaseOrderGrnService(fastify) {
  const { updateOutletPurchaseOrderGrnRepo } = outletPurchaseRepo(fastify);
  return async ({ body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = updateOutletPurchaseOrderGrnRepo.call(knex, {
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletPurchaseOutletListService(fastify) {
  const { getOutletPurchaseOutletListRepo } = outletPurchaseRepo(fastify);
  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseOutletListRepo.call(knex, {
      params,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postOutletPurchaseReturnService(fastify) {
  const { postOutletPurchaseReturnRepo } = outletPurchaseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletPurchaseReturnRepo.call(knex, {
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


function getOutletPurchaseDetailsService(fastify) {
  const { getOutletPurchaseDetailsRepo } = outletPurchaseRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getOutletPurchaseDetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  generateOutletPurchaseDocnoService,
  getOutletPurchaseOutletListService,
  getOutletPurchaseSupplierListService,
  getOutletPurchasePoListService,
  getOutletPurchaseItemListService,
  postOutletPurchaseService,
  updateOutletPurchaseOrderGrnService,
  getOutletGrnByIdService,
  postOutletPurchaseReturnService,
  getOutletPurchaseDetailsService,
  postOutletManualPurchaseService
};
