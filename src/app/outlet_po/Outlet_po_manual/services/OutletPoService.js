const emailRepo = require("../../vendor_mail/repository/email.js");
const OutletRepo = require("../repository/OutletRepo.js");

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

function putOutletPoUnApprovedProductService(fastify) {
  const { putoutletPoUnApprovedProduct } = OutletRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putoutletPoUnApprovedProduct.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getOutletPoUnApprovedProductService(fastify) {
  const { getOutletPoUnApprovedProduct } = OutletRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPoUnApprovedProduct.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

function getOutletPoApprovalReportService(fastify) {
  const { getOutletPoApprovalReportProduct } = OutletRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPoApprovalReportProduct.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}


function getOutletPoAmendmentReportService(fastify) {
  const { getOutletPoAmendmentReportRepo } = OutletRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPoAmendmentReportRepo.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

function getOutletPoOverviewService(fastify) {
  const { getOutletPoOverview } = OutletRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPoOverview.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

function getOutletPoDetailsBySupplierService(fastify) {
  const { getOutletPoDetailsBySupplierRepo } = OutletRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPoDetailsBySupplierRepo.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

function getOutletPoApprovalListService(fastify) {
  const { getOutletPoProductDateWiseRepo } = OutletRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getOutletPoProductDateWiseRepo.call(knex, {
      params,
      body,
      logTrace,
      queryString: query,
      userDetails
    });

    const [response] = await Promise.all([promise1]);

    return response;
  };
}

// function putOutletPoApprovedService(fastify) {
//   const { putoutletPoApprovedRepo } = OutletRepo(fastify);
//   return async ({ body, params, logTrace, userDetails }) => {
//     const knex = fastify.knexMedical;

//     const promise1 = putoutletPoApprovedRepo.call(knex, {
//       body, params, logTrace, userDetails
//     });
//     const [response] = await Promise.all([promise1]);
//     return response;
//   };
// }

function putOutletPoApprovedService(fastify) {
  const { putoutletPoApprovedRepo, getOutletVendorMailDetailsRepo } = OutletRepo(fastify);
  const { sendPOApprovalMail } = emailRepo(fastify);

  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = putoutletPoApprovedRepo.call(knex, {
      body, params, logTrace, userDetails
    });

    const promise2 = getOutletVendorMailDetailsRepo.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response, poList] = await Promise.all([promise1, promise2]);
    console.log("Background poList:", poList);

    if (!poList || poList.length === 0) {
      logTrace?.info?.("No PO mail data found in background");
      return;
    }

    for (const po of poList) {
      const { po_no, outlet_id, mailData } = po;

      if (!po_no || !outlet_id) {
        logTrace?.error?.("Skipping PO (missing data)", po);
        continue;
      }

      sendPOApprovalMail({
        po_no,
        outlet_id,
        mailData
      }).catch(err => {
        console.error("Mail failed:", err);
        logTrace?.error?.("Mail send failed", err);
      });
    }
    return response;
  };
}

function resentPoMailservice(fastify) {
  const { resendPoMailRepo } = OutletRepo(fastify);
  const { sendPOApprovalMail } = emailRepo(fastify);

  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await resendPoMailRepo.call(knex, {
      body, params, logTrace, userDetails
    });

    const poList = response?.data || [];

    console.log(poList)

    if (!poList.length) {
      logTrace?.info?.("No PO mail data found");
      return response;
    }

    poList.forEach(po => {
      const { po_no, outlet_id, mailData } = po;

      if (!po_no || !outlet_id) {
        logTrace?.error?.("Skipping PO (missing data)", po);
        return;
      }

      sendPOApprovalMail({ po_no, outlet_id, mailData })
        .catch(err => {
          logTrace?.error?.("Mail send failed", {
            po_no,
            outlet_id,
            err
          });
        });
    });

    return response;
  };
}

function putOutletPoQtyUpdateService(fastify) {
  const { updatePoQtyRepo } = OutletRepo(fastify);
  return async ({ body, params, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = updatePoQtyRepo.call(knex, {
      body, params, logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putOutletPomasterGrndetailsServices(fastify) {
  const { putOutletPomasterGrndetailsRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = putOutletPomasterGrndetailsRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseOrdereOutletListServices(fastify) {
  const { getPurchaseOrdereOutletListRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseOrdereOutletListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseOrderSupplierListServices(fastify) {
  const { getPurchaseOrderSupplierListRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseOrderSupplierListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getPurchaseOrderBrandCompanyListServices(fastify) {
  const { getPurchaseOrderBrandCompanyListRepo } = OutletRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getPurchaseOrderBrandCompanyListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
    });
    const [response] = await Promise.all([promise1]);
    return response;
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
  putOutletPoUnApprovedProductService,
  getOutletPoUnApprovedProductService,
  getOutletPoApprovalReportService,
  getOutletPoOverviewService,
  getOutletPoDetailsBySupplierService,
  getOutletPoApprovalListService,
  putOutletPoApprovedService,
  putOutletPomasterGrndetailsServices,
  putOutletPoQtyUpdateService,
  getPurchaseOrdereOutletListServices,
  getPurchaseOrderSupplierListServices,
  getPurchaseOrderBrandCompanyListServices,
  resentPoMailservice,
  getOutletPoAmendmentReportService
};
