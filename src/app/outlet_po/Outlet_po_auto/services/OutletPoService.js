const { StatusCodes } = require("http-status-codes");
const OutletRepo = require("../repository/OutletRepo.js");
const emailRepo = require("../../vendor_mail/repository/email.js");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function getOutletPoPonoSerevice(fastify) {
  const { getoutletPurchaseOrderPono } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getoutletPurchaseOrderPono.call(knex, {
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

function getProductBySupplierService(fastify) {
  const { getProductBySupplierRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getProductBySupplierRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postOutletPurchaseOrderProductService(fastify) {
  const { postOutletPurchaseOrder } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletPurchaseOrder.call(knex, {
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

function postOutletPurchaseOrderProductTempService(fastify) {
  const { postOutletPurchaseOrderTemp } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletPurchaseOrderTemp.call(knex, {
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

function postOutletPurchaseOrderProductFinalService(fastify) {
  const { postOutletPurchaseOrderFinal } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postOutletPurchaseOrderFinal.call(knex, {
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

function getOutletPurchaseOrderUnApprovedListService(fastify) {
  const { getOutletPurchaseOrderUnApprovedListRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPurchaseOrderUnApprovedListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletPurchaseOrderApprovedItemService(fastify) {
  const { getOutletPurchaseOrderApprovedItem } = OutletRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPurchaseOrderApprovedItem.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putOutletPurchaseOrderProductService(fastify) {
  const { putOutletPurchaseOrderProductRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putOutletPurchaseOrderProductRepo.call(knex, {
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

function deleteOutletPurchaseOrderProductService(fastify) {
  const { deleteOutletPurchaseOrderProductRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = deleteOutletPurchaseOrderProductRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getautopogenerateService(fastify) {
  const { getAutopogeneraterRepo, vendorPoApprovalEmailRepo } = OutletRepo(fastify);
  const { sendPOApprovalMail } = emailRepo(fastify);

  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();

    // ✅ Step 1: Main process (WAIT)
    const response = await getAutopogeneraterRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query,
      financialYear
    });

    // ✅ Step 2: Background email process (DON’T WAIT)
    if (response?.success === true) {
      (async () => {
        try {
          const poList = await vendorPoApprovalEmailRepo.call(knex, { logTrace });

          if (!Array.isArray(poList) || poList.length === 0) {
            logTrace?.info?.("No PO mail data found");
            return;
          }

          for (const po of poList) {
            const { po_no, outlet_id, mailData } = po;

            if (!po_no || !outlet_id || !mailData || !Object.keys(mailData).length) {
              logTrace?.error?.("Skipping PO (invalid mail data)", po);
              continue;
            }

            sendPOApprovalMail({ po_no, outlet_id, mailData })
              .catch(err => {
                logTrace?.error?.("Mail send failed", {
                  po_no,
                  outlet_id,
                  error: err.message
                });
              });
          }
        } catch (err) {
          logTrace?.error?.("Background mail process failed", err);
        }
      })(); // 🔥 fire-and-forget
    }

    // ✅ Step 3: Return immediately
    return response;
  };
}


function getAutoPoBrandCompanyService(fastify) {
  const { getAutoPoBrandCompanyRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();

    const promise1 = getAutoPoBrandCompanyRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      query,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletDsdPoStatusListService(fastify) {
  const { getOutletDsdPoStatusListRepo } = OutletRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletDsdPoStatusListRepo.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function getOutletDsdPoStatusListWithEmailService(fastify) {
  const { getOutletDsdPoStatusListWithEmail } = OutletRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    return await getOutletDsdPoStatusListWithEmail.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
  };
}


function updateOutletDsdPoSendBackToFinanceService(fastify) {
  const { updateOutletDsdPoSendBackToFinanceRepo } = OutletRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    return await updateOutletDsdPoSendBackToFinanceRepo.call(knex, {
      body,
      params,
      logTrace,
      userDetails
    });
  };
}
module.exports = {
  getOutletPoPonoSerevice,
  getProductBySupplierService,
  postOutletPurchaseOrderProductService,
  getOutletPurchaseOrderUnApprovedListService,
  getOutletPurchaseOrderApprovedItemService,
  putOutletPurchaseOrderProductService,
  deleteOutletPurchaseOrderProductService,
  getautopogenerateService,
  getAutoPoBrandCompanyService,
  getautopogenerateService,
  postOutletPurchaseOrderProductTempService,
  postOutletPurchaseOrderProductFinalService,
  getFinancialYear,
  getOutletDsdPoStatusListService,
  getOutletDsdPoStatusListWithEmailService,
  updateOutletDsdPoSendBackToFinanceService
};
