const barCodeRepo = require("../repository/barcode");

function getBarcodeConfigService(fastify) {
    const { getBarcodeConfig } = barCodeRepo(fastify);

    return async ({ params, body, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getBarcodeConfig.call(knex, {
            params,
            body,
            logTrace
        });
        return response;
    };
}

function postBarcodeCheckService(fastify) {
    const { postBarcodeCheck } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = postBarcodeCheck.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}

function postBarcodeListService(fastify) {
    const { postBarcodeList } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = postBarcodeList.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}

function deleteBarcodeListService(fastify) {
    const { deleteBarcodeList } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const { barcode_id } = params;


        const promise1 = deleteBarcodeList.call(knex, {
            barcode_id,
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}


function delBarcodeListService(fastify) {
    const { delBarcodeList } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;


        const promise1 = delBarcodeList.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}

function postBarcodeConfigService(fastify) {
    const { postBarcodeConfig } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = postBarcodeConfig.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}
function generateBarcodeService(fastify) {
    const { generateBarcode } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = generateBarcode.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}
function getBarcodeListAginstPurchaseService(fastify) {
    const { getBarcodeListAginstPurchase } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = getBarcodeListAginstPurchase.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);

        const transformedResponse = response.map(row => ({
            id: row.id,
            is_active: row.is_active,
            title: "GIRLUSH",
            sub_title: row.short_name,
            mrp: "Rs." + row.mrp,
            barcode: row.barcode

        }));

        const remainder = transformedResponse.length % 4;
        if (remainder !== 0) {
            const emptyObjectsToAdd = 4 - remainder;
            const lastData = transformedResponse[transformedResponse.length - 1];

            for (let i = 0; i < emptyObjectsToAdd; i++) {
                transformedResponse.push({ ...lastData });
            }
        }

        return transformedResponse;
    };
}
function deactivateBarcodeService(fastify) {
    const { deactivateBarcode } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = deactivateBarcode.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}

function iscloseBarcodeService(fastify) {
    const { iscloseBarcode } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = iscloseBarcode.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}
function isMissedBarcodeService(fastify) {
    const { isMissedBarcode } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = isMissedBarcode.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}
function barcodeCompleteHistoryService(fastify) {
    const { barcodeCompleteHistory } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = barcodeCompleteHistory.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        let status_name;
        if (response.is_sold === false) {
            switch (true) {
                case (response.outlet_id == null):
                    status_name = "Warehouse";
                    break;
                case (response.is_verified === 0):
                    status_name = "Transfer";
                    break
                case (response.is_verified === 1 && response.is_missed === false):
                    status_name = "Verified";
                    break;
                case (response.is_missed === true):
                    status_name = "stock missed";
                    break;
                default:
                    status_name = "Not Verified";
            }
        } else {
            status_name = "Sold";
        }

        return {
            ...response,
            status_name
        }

    };



    // 244600224322
}

// function getBarcodeListService(fastify) {
//     const { getBarcodeList } = barCodeRepo(fastify);
//     return async ({ params, body, query, logTrace, userDetails }) => {
//         const knex = fastify.knexMedical;
//         const { warhouse_status, is_sold_status } = query;

//         const promise1 = getBarcodeList.call(knex, {
//             params,
//             body,
//             warhouse_status, is_sold_status,
//             logTrace,
//             userDetails
//         });
//         const [response] = await Promise.all([promise1]);
//         const transformedResponse = {
//             data: response.data.map(item => {
//                 console.log(item, "item");
//                 return {
//                     id: item.id,
//                     is_active: item.is_active,
//                     title: "GIRLUSH",
//                     sub_title: item.item_short_name,
//                     mrp: "Rs." + item.mrp,
//                     barcode: item.barcode,
//                     item_name: item.pro_name,
//                     is_sold: item.is_sold,
//                     is_verified: item.is_verified,
//                     code: item.code,
//                     fullname: item.fullname,
//                     short_name: item.short_name,
//                     main_category_name: item.main_category_name,
//                     sub_category_name: item.sub_category_name,
//                     special_discount: item.special_discount
//                 };
//             }),
//             meta: response.meta
//         };
//         return transformedResponse;
//     };
// }
function getBarcodeListService(fastify) {
    const { getBarcodeList } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = getBarcodeList.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        const transformedResponse = {
            data: response.data.map(item => {
                // console.log(item, "item");
                return {
                    id: item.id,
                    is_active: item.is_active,
                    title: "GIRLUSH",
                    sub_title: item.item_short_name,
                    mrp: "Rs." + item.mrp,
                    barcode: item.barcode,
                    item_name: item.pro_name,
                    is_sold: item.is_sold,
                    is_verified: item.is_verified,
                    code: item.code,
                    fullname: item.fullname,
                    short_name: item.short_name,
                    main_category_name: item.main_category_name,
                    sub_category_name: item.sub_category_name,
                    special_discount: item.special_discount
                };
            }),
            meta: response.meta
        };
        return transformedResponse;
    };
}

function postEntryCheckService(fastify) {
    const { postEntryCheck } = barCodeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = postEntryCheck.call(knex, {
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
    postBarcodeCheckService,
    postBarcodeConfigService,
    getBarcodeConfigService,
    generateBarcodeService,
    getBarcodeListAginstPurchaseService,
    deactivateBarcodeService,
    getBarcodeListService,
    postBarcodeListService,
    deleteBarcodeListService,
    postEntryCheckService,
    delBarcodeListService,
    iscloseBarcodeService,
    barcodeCompleteHistoryService,
    isMissedBarcodeService

};
