const { StatusCodes } = require("http-status-codes");
const syncfetchRepo = require("../repository/syncfetchRepo");
const getSyncTransformer = require("../transfomers/getSyncTransformer");
const { getFinancialYear } = require("../../../outlet_po/Outlet_po_auto/services/OutletPoService");

function getUnitDetailsService(fastify) {
    const { getUnitsSync } = syncfetchRepo(fastify);

    return async ({ params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const promise1 = getUnitsSync.call(knex, { params, logTrace, query });
        const [response] = await Promise.all([promise1]);

        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getUnitDetailsTranformer(response);

        return formattedResponse;
    };
}

function getReDetailsService(fastify) {
    const { getReDetailsRepo } = syncfetchRepo(fastify);
    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = getReDetailsRepo.call(knex, {
            body,
            params,
            query,
            logTrace,
            userDetails
        });

        const [response] = await Promise.all([promise1]);
        const formattedResponse = await getSyncTransformer.getReDetailsTransformer(response);

        return formattedResponse;
    };
}


function putReDetailsService(fastify) {
    const { updateReDetailsRepo } = syncfetchRepo(fastify);
    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = updateReDetailsRepo.call(knex, {
            body,
            params,
            query,
            logTrace,
            userDetails
        });

        const [response] = await Promise.all([promise1]);
        return response;
    };
}

function getBrandsSyncDetailsService(fastify) {
    const { getBrandSyncDetails } = syncfetchRepo(fastify);

    return async ({ params, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await getBrandSyncDetails.call(knex, {
            company_id,
            query,
            params
        });
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getBrandDetailsTranformer(response);
        return formattedResponse;
    };
}

function getBrandCompanyDetailsService(fastify) {
    const { getBrandCompanySyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body, query }) => {
        const knex = fastify.knexMedical;
        const promise1 = getBrandCompanySyncDetails.call(knex, {
            params,
            logTrace,
            body,
            query
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getBrandCompanyDetailsTranformer(response);
        return formattedResponse;
    }
}

function getMerchantCategoryDetailsService(fastify) {
    const { getMerchantCategorySyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body, query }) => {
        const knex = fastify.knexMedical;
        const promise1 = getMerchantCategorySyncDetails.call(knex, {
            params,
            logTrace,
            body,
            query
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getMerchantCategoryDetailsTranformer(response);
        return formattedResponse;
    }
}

function getCategoryDetailsService(fastify) {
    const { getCategorySyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body, query }) => {
        const knex = fastify.knexMedical;
        const promise1 = getCategorySyncDetails.call(knex, {
            params,
            logTrace,
            body,
            query
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getCategoryDetailsTranformer(response);
        return formattedResponse;
    }
}

function getItemDeleteDetailsService(fastify) {
    const { getCategorySyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = getCategorySyncDetails.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getCategoryDetailsTranformer(response);
        return formattedResponse;
    }
}

function getCategoryEditDetailsService(fastify) {
    const { getCategoryEditSyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = getCategoryEditSyncDetails.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getCategoryEditDetailsTranformer(response);
        return formattedResponse;
    }
}

function getBrandEditDetailsService(fastify) {
    const { getBrandEditSyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = getBrandEditSyncDetails.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getBrandEditDetailsTranformer(response);
        return formattedResponse;
    }
}

function getMerchantCategoryEditDetailsService(fastify) {
    const { getMerchantCategoryEditDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = getMerchantCategoryEditDetails.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getMerchantCategoryEditDetailsTranformer(response);
        return formattedResponse;
    }
}

function getBrandCompanyEditDetailsService(fastify) {
    const { getBrandCompanyEditSyncDetails } = syncfetchRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = getBrandCompanyEditSyncDetails.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getBrandCompanyEditDetailsTranformer(response);
        return formattedResponse;
    }
}

function getItemBarcodeSyncDetailsService(fastify) {
    const { getItemBarcodeSyncDetails } = syncfetchRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await getItemBarcodeSyncDetails.call(knex, {
            company_id,
            params
        });
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getItemBarcodeDetailsTransformer(response);
        return formattedResponse;
    };
}


function getItemSettingsSyncDetailsService(fastify) {
    const { getItemSettingSyncDetails } = syncfetchRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await getItemSettingSyncDetails.call(knex, {
            company_id,
            params
        });
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getItemSettingDetailsTransformer(response);
        return formattedResponse;
    };
}

function getProductMasterSyncDetailsService(fastify) {
    const { getProductMasterSyncDetails } = syncfetchRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await getProductMasterSyncDetails.call(knex, {
            company_id,
            params
        });
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getProductMasterDetailsTransformer(response);
        return formattedResponse;
    };
}

function getProductMasterEditSyncDetailsService(fastify) {
    const { getProductMasterEditSyncDetails } = syncfetchRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await getProductMasterEditSyncDetails.call(knex, {
            company_id,
            params
        });
        // Ensure response is an array before sending to transformer
        const formattedResponse = await getSyncTransformer.getProductMasterEditDetailsTransformer(response);
        return formattedResponse;
    };
}

function putProductMasterSyncDetailsService(fastify) {
    const { putProductSyncDetails } = syncfetchRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await putProductSyncDetails.call(knex, {
            body,
            params,
            logTrace,
            queryString: query,
            userDetails
        });
        return response;

    };
}

function getSyncSupplierOutletMappingService(fastify) {
    const { getSuplierOutletMappingDetailsRepo } = syncfetchRepo(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await getSuplierOutletMappingDetailsRepo.call(knex, {
            body,
            params,
            logTrace,
            userDetails
        });

        return response;
    };
}
function putSyncSupplierOutletMappingService(fastify) {
    const { putSuplierOutletMappingDetailsRepo } = syncfetchRepo(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await putSuplierOutletMappingDetailsRepo.call(knex, {
            body,
            params,
            logTrace,
            userDetails
        });

        return response;
    };
}
function getSyncSupplierInsertUpdateDetailsService(fastify) {
    const { getSuplierInsertUpdateDetailsRepo } = syncfetchRepo(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await getSuplierInsertUpdateDetailsRepo.call(knex, {
            body,
            params,
            logTrace,
            userDetails
        });

        return response;
    };
}
function putSyncSupplierFlagUpdateService(fastify) {
    const { putSyncSupplierFlagUpdateRepo } = syncfetchRepo(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await putSyncSupplierFlagUpdateRepo.call(knex, {
            body,
            params,
            logTrace,
            userDetails
        });

        return response;
    };
}
function getSyncOutletPoDetailsService(fastify) {
    const { getSyncOutletPoDetailsRepo } = syncfetchRepo(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await getSyncOutletPoDetailsRepo.call(knex, {
            body,
            params,
            logTrace,
            userDetails
        });

        return response;
    };
}

function getpoSyncPaginateService(fastify) {
    const { getpoSyncPaginate } = syncfetchRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const response = await getpoSyncPaginate.call(knex, {
            params,
            body,
            logTrace,
            page_size: query.page_size || 10,
            current_page: query.current_page || 1
        });

        return {
            status: StatusCodes.OK,
            message: "success",
            po_no: response.po_no,
            master: response.master,
            details: response.details,   // DETAILS ARRAY
            meta: response.meta        // PAGINATION META (NOW IT WORKS)
        };
    };
}

function putOutletPOSyncService(fastify) {
    const { putOutletPOSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = putOutletPOSyncRepo.call(knex, {
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

function getPurchaseSyncService(fastify) {
    const { getPurchaseSyncRepo } = syncfetchRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const response = await getPurchaseSyncRepo.call(knex, {
            params,
            body,
            logTrace
        });

        return {
            status: StatusCodes.OK,
            message: "success",
            grn_no: response.grn_no,
            master: response.master,
            details: response.details,
        };
    };
}

function putOutletGrnSyncService(fastify) {
    const { putOutletGrnSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = putOutletGrnSyncRepo.call(knex, {
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

function getPurchaseReturnSyncService(fastify) {
    const { getPurchaseReturnSyncRepo } = syncfetchRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const response = await getPurchaseReturnSyncRepo.call(knex, {
            params,
            body,
            logTrace
        });

        return {
            status: StatusCodes.OK,
            message: "success",
            doc_no: response.docNo,
            master: response.master,
            details: response.details,
        };
    };
}

function putOutletPurchaseReturnSyncService(fastify) {
    const { putOutletPurchaseReturnSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = putOutletPurchaseReturnSyncRepo.call(knex, {
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

function getOutletDebitNoteSyncService(fastify) {
    const { getOutletDebitNoteSyncRepo } = syncfetchRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const response = await getOutletDebitNoteSyncRepo.call(knex, {
            params,
            body,
            logTrace
        });

        return {
            status: StatusCodes.OK,
            message: "success",
            doc_no: response.docNo,
            master: response.master,
            details: response.details,
        };
    };
}
function putOutletDebitNoteSyncService(fastify) {
    const { putOutletDebitNoteSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = putOutletDebitNoteSyncRepo.call(knex, {
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

function getWarehouseSalesSyncService(fastify) {
    const { getWarehouseSalesSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const promise1 = getWarehouseSalesSyncRepo.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}


function updateWarehouseSalesSyncService(fastify) {
    const { updateWarehouseSalesSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const promise1 = updateWarehouseSalesSyncRepo.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}

function getWarehouseSalesReturnSyncService(fastify) {
    const { getWarehouseSalesReturnSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const promise1 = getWarehouseSalesReturnSyncRepo.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}


function updateWarehouseSalesReturnSyncService(fastify) {
    const { updateWarehouseSalesReturnSyncRepo } = syncfetchRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const promise1 = updateWarehouseSalesReturnSyncRepo.call(knex, {
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
    getBrandsSyncDetailsService,
    getUnitDetailsService,
    getBrandCompanyDetailsService,
    getMerchantCategoryDetailsService,
    getCategoryDetailsService,
    getItemDeleteDetailsService,
    getCategoryEditDetailsService,
    getBrandEditDetailsService,
    getMerchantCategoryEditDetailsService,
    getBrandCompanyEditDetailsService,
    getItemBarcodeSyncDetailsService,
    getItemSettingsSyncDetailsService,
    getProductMasterSyncDetailsService,
    getProductMasterEditSyncDetailsService,
    putProductMasterSyncDetailsService,
    getSyncSupplierOutletMappingService,
    putSyncSupplierOutletMappingService,
    getSyncSupplierInsertUpdateDetailsService,
    putSyncSupplierFlagUpdateService,
    getSyncOutletPoDetailsService,
    getReDetailsService,
    putReDetailsService,
    getpoSyncPaginateService,
    putOutletPOSyncService,
    getPurchaseSyncService,
    putOutletGrnSyncService,
    getPurchaseReturnSyncService,
    putOutletPurchaseReturnSyncService,
    getOutletDebitNoteSyncService,
    putOutletDebitNoteSyncService,
    getWarehouseSalesSyncService,
    updateWarehouseSalesSyncService,
    getWarehouseSalesReturnSyncService,
    updateWarehouseSalesReturnSyncService

}