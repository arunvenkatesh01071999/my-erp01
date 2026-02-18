const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { BARCODE_CONFIG, BARCODE_LIST } = require("../commons/constant");
const { ITEM, OUTLET_PRODUCT_MAPPING, SUPPLIER, HEADS, TYPEDESIGN } = require("../../../catalog/commons");
const { PURCHASE_MST, PURCHASE_DETAILS } = require("../../../purchase/commons");
const { SALESDETAILS, SALESMASTER } = require("../../../sales/commons");

const { OUTLETS } = require("../../outlets/commons/constants")
const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { OUTLETSALESMASTER,
    OUTLETSALESDETAILS, } = require("../../../outlet_sales/outlet_sales_master/commons/constants");
const {
    OUTLETSALESRETURNDETAILS } = require("../../../outlet_sales/outlet_sales_return_master/commons/constants");

const { UNITS } = require("../../../catalog/units/commons/constants");
const { MISSING_STOCKS } = require("../../../closing_stock _outlet/commons");


function barCodeRepo(fastify) {
    async function getBarcodeConfig({ body, params, logTrace }) {
        const knex = this;
        const query = knex(BARCODE_CONFIG.NAME).where(BARCODE_CONFIG.COLUMNS.COMPANY_ID, params.company_id);
        logQuery({
            logger: fastify.log,
            query,
            context: "Get barcode config data",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "barcode config data found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response[0];
    }
    async function postBarcodeConfig({ params, body, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;
        const query = knex(BARCODE_CONFIG.NAME)
            .where(BARCODE_CONFIG.COLUMNS.COMPANY_ID, body.company_id);

        const exists_response = await query;

        if (exists_response.length > 0) {
            const query_update = await knex(`${BARCODE_CONFIG.NAME}`)
                .where(BARCODE_CONFIG.COLUMNS.COMPANY_ID, body.company_id)
                .update({
                    [BARCODE_CONFIG.COLUMNS.IS_INDIVIDUAL]: body.is_individual,
                    [BARCODE_CONFIG.COLUMNS.UPDATED_AT]: new Date(),
                    [BARCODE_CONFIG.COLUMNS.UPDATED_BY]: created_by
                });
            const response1 = await query_update;
            if (!response1) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: "Error while doing barcode configuration",
                    property: "",
                    code: "NOT_IMPLEMENTED"
                });
            }
            return { success: true };
        } else {
            const query_insert = await knex(`${BARCODE_CONFIG.NAME}`).insert({
                [BARCODE_CONFIG.COLUMNS.IS_INDIVIDUAL]: body.loyalty_amount,
                [BARCODE_CONFIG.COLUMNS.COMPANY_ID]: body.company_id,
                [BARCODE_CONFIG.COLUMNS.CREATED_BY]: created_by,
                [BARCODE_CONFIG.COLUMNS.UPDATED_BY]: created_by
            });
            const response = await query_insert;
            if (!response) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: "Error while doing barcode configuration",
                    property: "",
                    code: "NOT_IMPLEMENTED"
                });
            }
            return { success: true };
        }

    }

    async function postBarcodeList({ params, body, logTrace, userDetails }) {
        const knex = this;
        // const created_by = userDetails.id;
        const created_by = 2

        if (body.barcode_details.length > 0) {

            for (var i = 0; i < body.barcode_details.length; i++) {
                var barcode_details = body.barcode_details[i];

                const barcode_get = knex(`${BARCODE_LIST.NAME}`)
                    .where(`${BARCODE_LIST.COLUMNS.BARCODE}`, barcode_details.barcode)

                const barcode_get_response = await barcode_get;


                // console.log(barcode_get, "barcode_get");

                if (barcode_get_response == 0) {

                    const query_insert = await knex(`${BARCODE_LIST.NAME}`).insert({
                        [BARCODE_LIST.COLUMNS.PROD_ID]: barcode_details.prod_id,
                        [BARCODE_LIST.COLUMNS.BARCODE]: barcode_details.barcode,
                        [BARCODE_LIST.COLUMNS.IS_ACTIVE]: barcode_details.is_active || true,
                        [BARCODE_LIST.COLUMNS.COMPANY_ID]: barcode_details.company_id,
                        [BARCODE_LIST.COLUMNS.CREATED_BY]: created_by,
                        [BARCODE_LIST.COLUMNS.UPDATED_BY]: created_by
                    });

                }

                const query = knex(OUTLET_PRODUCT_MAPPING.NAME).where(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, barcode_details.prod_id);

                const exists_response = await query;

                if (exists_response == 0) {

                    const outlet_product_map_insert = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`).insert({
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: barcode_details.prod_id,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: barcode_details.pro_code,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: barcode_details.outlet_id,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: barcode_details.opng_stock,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: barcode_details.balnc_stock || 0.00,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: barcode_details.company_id,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: barcode_details.is_active || true,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: created_by,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: created_by
                    });

                }
                else {

                    const outlet_product_map_update = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`)
                        .where(`${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`, barcode_details.prod_id)
                        .update({
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: knex.raw(
                                `${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} + ${barcode_details.opng_stock}`
                            ),
                        });

                }

            }
        }

        // const response = await query_insert;

        // if (!response) {
        //     throw CustomError.create({
        //         httpCode: StatusCodes.NOT_IMPLEMENTED,
        //         message: "creating barcode list",
        //         property: "",
        //         code: "NOT_IMPLEMENTED"
        //     });
        // }

        return { success: true };
    }

    async function deleteBarcodeList({ barcode_id, params, body, logTrace, userDetails }) {
        const knex = this;
        // console.log(barcode_id, "barcode_id");
        const query = knex(BARCODE_LIST.NAME).where(BARCODE_LIST.COLUMNS.ID, barcode_id);

        const exists_response = await query;

        if (!exists_response.length > 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "Barcode not found to delete",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query_delete = knex(BARCODE_LIST.NAME)
            .where(BARCODE_LIST.COLUMNS.ID, barcode_id)
            .del();
        logQuery({
            logger: fastify.log,
            query,
            context: "delete barcode",
            logTrace
        });
        const response = await query_delete;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Barcode not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return { success: true };
    }

    async function delBarcodeList({ barcode_id, params, body, logTrace, userDetails }) {
        const knex = this;
        const { barcode } = body;

        if (barcode && Array.isArray(barcode) && barcode.length > 0) {
            for (const singleBarcode of barcode) {
                const exists_response = await knex(BARCODE_LIST.NAME)
                    .where(BARCODE_LIST.COLUMNS.BARCODE, singleBarcode);

                if (exists_response.length === 0) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_ACCEPTABLE,
                        message: `Barcode ${singleBarcode} not found to delete`,
                        property: "",
                        code: "NOT_ACCEPTABLE"
                    });
                }

                const query_delete = await knex(BARCODE_LIST.NAME)
                    .where(BARCODE_LIST.COLUMNS.BARCODE, singleBarcode)
                    .del();

                if (!query_delete) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: `Barcode ${singleBarcode} not found`,
                        property: "",
                        code: "NOT_FOUND"
                    });
                }

                // logQuery({
                //     logger: fastify.log,
                //     query: `DELETE FROM ${BARCODE_LIST.NAME} WHERE ${BARCODE_LIST.COLUMNS.BARCODE} = ${singleBarcode}`,
                //     context: "delete barcode",
                //     logTrace
                // });
            }
        }

        return { success: true };
    }

    async function postBarcodeCheck({ params, body, logTrace, userDetails }) {
        const knex = this;
        var outlet_id = body.outlet_id
        const str = body.starting_barcode;
        const starting_barcode = parseInt(str, 10);

        const str2 = body.ending_barcode;
        const ending_barcode = parseInt(str2, 10);

        var prod_id = body.prod_id

        var emptyArray = [];

        let available_status = "AVAILABLE"; // Assume initially available

        for (let i = starting_barcode; i <= ending_barcode; i++) {
            const query = knex(BARCODE_LIST.NAME)
                .select(BARCODE_LIST.COLUMNS.BARCODE)
                .where(function () {
                    this.where(BARCODE_LIST.COLUMNS.BARCODE, i)//barcode
                        .andWhere(BARCODE_LIST.COLUMNS.PROD_ID, prod_id)//1
                        .andWhere(BARCODE_LIST.COLUMNS.IS_SOLD, false)
                        .andWhere(BARCODE_LIST.COLUMNS.IS_ACTIVE, true)
                        // .whereNotIn(BARCODE_LIST.COLUMNS.OUTLET_ID, [outlet_id]);
                        .andWhere(BARCODE_LIST.COLUMNS.OUTLET_ID, null)
                });

            logQuery({
                logger: fastify.log,
                query,
                context: "Get Barcode List",
                logTrace
            });

            const exists_response = await query;


            if (exists_response.length > 0) {
                console.log("if");
                emptyArray.push({
                    barcode: i.toString(),
                    status: false
                });
            } else {
                console.log("else");
                emptyArray.push({
                    barcode: i.toString(),
                    status: true
                });

                // If any barcode is not available, set available_status to "NOT AVAILABLE"
                available_status = "NOT AVAILABLE";
            }
        }

        return {
            available_status: available_status,
            barcode_list: emptyArray
        };
    }


    async function generateBarcode({ body, params, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;
        const { financial_year, supplier_code, qty, prod_id, mrp, purchase_no, company_id, purchase_details_id } = body;

        const barcodes = [];
        // Get the last inserted ID from the table
        const lastIdQuery = await knex(BARCODE_LIST.NAME)
            .max('id')
            .where(BARCODE_LIST.COLUMNS.COMPANY_ID, company_id)
            .first();

        const lastId = lastIdQuery.max || 0; // Default to 0 if no records found

        // Generate unique barcode for each quantity
        for (let i = 0; i < qty; i++) {
            // Calculate the consecutive number based on the last inserted ID
            const consecutiveNumber = lastId + i + 1;
            // Format the barcode
            const formattedConsecutiveNumber = String(consecutiveNumber).padStart(8, "0");
            let formattedSupplier_code = supplier_code.toString().padStart(2, "0");
            const barcode = `${financial_year}${formattedSupplier_code}${formattedConsecutiveNumber}`;
            console.log("barcode :" + barcode);
            console.log("formattedSupplier_code :" + formattedSupplier_code);
            // Push the barcode into the array
            // Push the barcode into the array
            barcodes.push(barcode);
            const query = await knex(`${BARCODE_LIST.NAME}`).insert({
                [BARCODE_LIST.COLUMNS.PROD_ID]: prod_id,
                [BARCODE_LIST.COLUMNS.BARCODE]: barcode,
                [BARCODE_LIST.COLUMNS.PURCHASE_NO]: purchase_no,
                [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                [BARCODE_LIST.COLUMNS.PURCHASE_DETAILS_ID]: purchase_details_id,
                [BARCODE_LIST.COLUMNS.CREATED_BY]: created_by,
                [BARCODE_LIST.COLUMNS.UPDATED_BY]: created_by
            });
        }


        const query_update1 = await knex(`${PURCHASE_MST.NAME}`)
            .where(PURCHASE_MST.COLUMNS.DOCNO, purchase_no)
            .update({
                [PURCHASE_MST.COLUMNS.IS_BARCODE_GENERATED]: 1,
                [PURCHASE_MST.COLUMNS.UPDATED_AT]: new Date(),
                [PURCHASE_MST.COLUMNS.UPDATED_BY]: created_by
            });
        const query_update2 = await knex(`${PURCHASE_DETAILS.NAME}`)
            .where(PURCHASE_DETAILS.COLUMNS.DOCNO, purchase_no)
            .where(PURCHASE_DETAILS.COLUMNS.PROD_ID, prod_id)
            .where(PURCHASE_DETAILS.COLUMNS.ID, purchase_details_id)
            .update({
                [PURCHASE_DETAILS.COLUMNS.IS_BARCODE_GENERATED_LIST]: 1,
                [PURCHASE_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                [PURCHASE_DETAILS.COLUMNS.UPDATED_BY]: created_by
            });

        return { success: true };


    }
    async function getBarcodeListAginstPurchase({ body, params, logTrace }) {
        const knex = this;


        const queryPurchaseDetailsId = await knex
            .select([`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PURCHASE_DETAILS_ID}`])
            .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
            .where(BARCODE_LIST.COLUMNS.PROD_ID, params.prod_id)
            .where(BARCODE_LIST.COLUMNS.PURCHASE_NO, params.purchase_no);


        var query = knex
            .select([
                `${BARCODE_LIST.NAME}.*`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
            ])
            .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
            )
            .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.COMPANY_ID}`, params.company_id)
            .where(BARCODE_LIST.COLUMNS.PROD_ID, params.prod_id)
            .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_ACTIVE}`, true)
            .where(BARCODE_LIST.COLUMNS.IS_SOLD, false)
            .where(BARCODE_LIST.COLUMNS.PURCHASE_NO, params.purchase_no)
            .orderBy(`${BARCODE_LIST.COLUMNS.BARCODE}`, 'DESC');

        if (queryPurchaseDetailsId.length > 0 && queryPurchaseDetailsId[0].purchase_details_id) {
            query = query.where(BARCODE_LIST.COLUMNS.PURCHASE_DETAILS_ID, params.purchase_details_id);
        }

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "barcode list data found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function iscloseBarcode({ params, body, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;
        const query = knex(BARCODE_LIST.NAME)
            .where(BARCODE_LIST.COLUMNS.OUTLET_ID, body.outlet_id);

        const exists_response = await query;

        if (!exists_response.length > 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "This barcode is not found",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }
        const query_update = await knex(`${BARCODE_LIST.NAME}`)
            .where(BARCODE_LIST.COLUMNS.OUTLET_ID, body.outlet_id)
            .andWhere(BARCODE_LIST.COLUMNS.IS_CLOSED, 1)
            .update({
                [BARCODE_LIST.COLUMNS.IS_CLOSED]: body.is_closed,
                [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
                [BARCODE_LIST.COLUMNS.UPDATED_BY]: created_by
            });
        const response1 = await query_update;
        if (!response1) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while doing barcode activate or deactivate",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }
        return { success: true };
    }

    async function isMissedBarcode({ params, body, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;
        const query = knex(BARCODE_LIST.NAME)
            .where(BARCODE_LIST.COLUMNS.OUTLET_ID, body.outlet_id);

        const exists_response = await query;

        if (!exists_response.length > 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "This barcode is not found",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }
        const query_update = knex(`${BARCODE_LIST.NAME}`)
            .where(BARCODE_LIST.COLUMNS.OUTLET_ID, body.outlet_id)
            .andWhere(BARCODE_LIST.COLUMNS.BARCODE, body.barcode)
            .andWhere(BARCODE_LIST.COLUMNS.IS_MISSED, true)
            .update({
                [BARCODE_LIST.COLUMNS.IS_MISSED]: body.is_missed,
                // [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
                // [BARCODE_LIST.COLUMNS.UPDATED_BY]: created_by
            });
        const response1 = await query_update;


        const query_update2 = knex(`${MISSING_STOCKS.NAME}`)
            .where(MISSING_STOCKS.COLUMNS.OUTLET_ID, body.outlet_id)
            .andWhere(MISSING_STOCKS.COLUMNS.BARCODE, body.barcode)
            .andWhere(MISSING_STOCKS.COLUMNS.IS_REACTIVATE, false)
            .update({
                [MISSING_STOCKS.COLUMNS.IS_REACTIVATE]: true
            });
        const response2 = await query_update2;


        // if (!response2) {
        //     throw CustomError.create({
        //         httpCode: StatusCodes.NOT_IMPLEMENTED,
        //         message: "Error while doing barcode activate or deactivate",
        //         property: "",
        //         code: "NOT_IMPLEMENTED"
        //     });
        // }

        // if (!response1) {
        //     throw CustomError.create({
        //         httpCode: StatusCodes.NOT_IMPLEMENTED,
        //         message: "Error while doing barcode activate or deactivate",
        //         property: "",
        //         code: "NOT_IMPLEMENTED"
        //     });
        // }
        return { success: true };
    }
    // async function barcodeCompleteHistory({ params, body, logTrace, userDetails }) {
    //     const knex = this;
    //     const barcode = body.barcode

    //     const query = knex
    //         .select([
    //             // `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCNO}`,
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PURCHASE_NO} as docno`,
    //             `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCDATE}`,
    //             `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME} as sup_name`,
    //             `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as sup_code`,
    //             `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO} as osd_billno`,
    //             `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE} as osd_docdate`,
    //             `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.MOBILE}`,
    //             `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.PARTY_NAME}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.PARCHASE_RATE}`,
    //             `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
    //             `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
    //             `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
    //             `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
    //             `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`,
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`,
    //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
    //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
    //             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCNO} as transfer_docno`,
    //             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE} as transfer_docdate`,
    //             knex.raw(
    //                 `COALESCE(outlet_sales_details.docdate, CURRENT_DATE) AS osd_docdate`
    //             ),
    //             knex.raw(
    //                 `COALESCE(DATE_PART('day', COALESCE(outlet_sales_details.docdate, CURRENT_DATE) - purchase_details.docdate), 0) AS aging`
    //             )
    //         ])
    //         .from(`${PURCHASE_DETAILS.NAME} as ${PURCHASE_DETAILS.NAME}`)
    //         .leftJoin(
    //             `${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`,
    //             `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCNO}`,
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PURCHASE_NO}`
    //         )

    //         .leftJoin(
    //             `${OUTLETSALESDETAILS.NAME} as ${OUTLETSALESDETAILS.NAME}`,
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
    //             `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.BARCODE}`
    //         ).leftJoin(
    //             `${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
    //             `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
    //             `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`
    //         ).leftJoin(
    //             `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,
    //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             knex('sales_details')
    //                 .select('*')
    //                 .where('barcode', '<=', barcode)
    //                 .andWhere('barcode_to', '>=', barcode)
    //                 .as('filtered_sales_details'),
    //             'barcode_list.prod_id',
    //             'filtered_sales_details.prodid'
    //         )
    //         // .leftJoin(
    //         //     `${SALESDETAILS.NAME} as ${SALESDETAILS.NAME}`,
    //         //     `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
    //         //     `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`
    //         // )
    //         .leftJoin(
    //             `${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
    //             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCNO}`,
    //             `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.DOCNO}`
    //         )
    //         .leftJoin(
    //             `${PURCHASE_MST.NAME} as ${PURCHASE_MST.NAME}`,
    //             `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PURMST_ID}`,
    //             `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
    //             `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
    //             `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${ITEM.NAME} as ${ITEM.NAME}`,
    //             `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PROD_ID}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${UNITS.NAME} as ${UNITS.NAME}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
    //             `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${HEADS.NAME} as ${HEADS.NAME}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
    //             `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
    //             `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
    //             `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
    //         )
    //         .leftJoin(
    //             `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
    //             `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
    //             `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
    //         )
    //         .where(
    //             `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
    //             barcode
    //         )
    //     // .andWhere(
    //     //     `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.BARCODE}`,
    //     //     '<=',
    //     //     barcode
    //     // )
    //     // .andWhere(
    //     //     `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.BARCODE_TO}`,
    //     //     '>=',
    //     //     barcode
    //     // )



    //     logQuery({
    //         logger: fastify.log,
    //         query,
    //         context: "Get Barcode History",
    //         logTrace
    //     });
    //     const response = await query;
    //     console.log(response, "response1");

    //     if (!response.length) {
    //         throw CustomError.create({
    //             httpCode: StatusCodes.NOT_FOUND,
    //             message: "Barcode History data not found",
    //             property: "",
    //             code: "NOT_FOUND"
    //         });
    //     }

    //     return response[0];
    // }
    async function barcodeCompleteHistory({ params, body, logTrace, userDetails }) {
        const knex = this;
        const barcode = body.barcode;

        const query = knex
            .select([
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PURCHASE_NO} as docno`,
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCDATE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME} as sup_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as sup_code`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO} as osd_billno`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE} as osd_docdate`,
                `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO} as osrd_billno`,
                `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.MOBILE}`,
                `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.PARTY_NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PARCHASE_RATE}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_CLOSED}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_MISSED}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,

                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `filtered_sales_details.docno as transfer_docno`,
                `filtered_sales_details.docdate as transfer_docdate`,
                knex.raw(
                    `COALESCE(outlet_sales_details.docdate, CURRENT_DATE) AS osd_docdate`
                ),
                knex.raw(
                    `COALESCE(DATE_PART('day', COALESCE(outlet_sales_details.docdate, CURRENT_DATE) - purchase_details.docdate), 0) AS aging`
                )
            ])
            .from(`${PURCHASE_DETAILS.NAME} as ${PURCHASE_DETAILS.NAME}`)
            .leftJoin(
                `${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`,
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCNO}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PURCHASE_NO}`
            )
            .leftJoin(
                `${OUTLETSALESDETAILS.NAME} as ${OUTLETSALESDETAILS.NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.BARCODE}`
            )
            .leftJoin(
                `${OUTLETSALESRETURNDETAILS.NAME} as ${OUTLETSALESRETURNDETAILS.NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
                `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.BARCODE}`
            )
            .leftJoin(
                `${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
                `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                knex('sales_details')
                    .select('*')
                    .where('barcode', '<=', barcode)
                    .andWhere('barcode_to', '>=', barcode)
                    .as('filtered_sales_details'),
                'barcode_list.prod_id',
                'filtered_sales_details.prodid'
            )
            .leftJoin(
                `${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
                `filtered_sales_details.docno`,
                `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.DOCNO}`
            )
            .leftJoin(
                `${PURCHASE_MST.NAME} as ${PURCHASE_MST.NAME}`,
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PURMST_ID}`,
                `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.ID}`
            )
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PROD_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
            )
            .leftJoin(
                `${UNITS.NAME} as ${UNITS.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .leftJoin(
                `${HEADS.NAME} as ${HEADS.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
                `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
            )
            .leftJoin(
                `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
            )
            .leftJoin(
                `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
            )
            .leftJoin(
                `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
            )
            .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, barcode);

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Barcode History",
            logTrace,
        });

        const response = await query;

        // console.log(response, "response1");

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Barcode History data not found",
                property: "",
                code: "NOT_FOUND",
            });
        }

        return response[0];
    }


    async function deactivateBarcode({ params, body, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;

        const query = knex(BARCODE_LIST.NAME)
            .where(BARCODE_LIST.COLUMNS.BARCODE, body.barcode);

        const exists_response = await query;

        if (!exists_response.length > 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "This barcode is not found",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }

        const query_update = await knex(`${BARCODE_LIST.NAME}`)
            .where(BARCODE_LIST.COLUMNS.BARCODE, body.barcode)
            .update({
                [BARCODE_LIST.COLUMNS.IS_ACTIVE]: body.is_active,
                [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
                [BARCODE_LIST.COLUMNS.UPDATED_BY]: created_by
            });

        const response1 = await query_update;
        if (!response1) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while doing barcode activate or deactivate",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }
        return { success: true };
    }

    async function getBarcodeList({ body, params, logTrace }) {
        const knex = this;

        const query = knex
            .select([
                `${BARCODE_LIST.NAME}.*`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.DIS_PER} as special_discount`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME} as item_short_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`
            ])
            .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${SUB_CATEGORY.NAME}`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`)
            .leftJoin(
                `${MAIN_CATEGORY.NAME}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`)

        // .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.COMPANY_ID}`, params.company_id)
        // // .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, false)
        // .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 0)


        if (params.outlet_id && params.outlet_id > 0) {
            query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, params.outlet_id)
        }

        if (params.outlet_id && params.outlet_id === -1) {
            query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, null)
        }

        if (params.g_v_status && params.g_v_status === 1) {
            query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 0)
        }

        if (params.g_v_status && params.g_v_status === 2) {
            query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 1)
        }

        if (params.s_us_status && params.s_us_status === 1) {
            query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, false)
        }

        if (params.s_us_status && params.s_us_status === 2) {
            query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, true)
        }


        query.orderBy(`${BARCODE_LIST.COLUMNS.ID}`, 'DESC');

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Barcode List",
            logTrace
        });

        if (params.search && params.search.length >= 1) {
            query
                .where(function () {
                    this.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, "ilike", `%${params.search}%`)
                        .orWhere(`${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${params.search}%`)
                        .orWhere(`${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`, "ilike", `%${params.search}%`)
                        .orWhere(`${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`, "ilike", `%${params.search}%`);
                });


            if (params.outlet_id && params.outlet_id > 0) {
                query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, params.outlet_id);
            }


        }


        const response = await query.paginate({
            pageSize: params.page_size,
            currentPage: params.current_page
        });

        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Barcode list not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        if (response.meta.pagination.total_pages < params.current_page) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "Requested page is beyond the available data",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }
        return response;
    }
    async function postEntryCheck({ body, params, logTrace }) {
        const knex = this;
        const query = knex(BARCODE_LIST.NAME)
            .where(BARCODE_LIST.COLUMNS.BARCODE, body.barcode);
        logQuery({
            logger: fastify.log,
            query,
            context: "Get barcode config data",
            logTrace
        });

        const response = await query;

        if (response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "barcode already found",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }
        return { success: true };
    }

    return {
        postBarcodeCheck,
        postBarcodeConfig,
        getBarcodeConfig,
        generateBarcode,
        getBarcodeListAginstPurchase,
        deactivateBarcode,
        getBarcodeList,
        postBarcodeList,
        deleteBarcodeList,
        postEntryCheck,
        delBarcodeList,
        iscloseBarcode,
        barcodeCompleteHistory,
        isMissedBarcode
    };
}

module.exports = barCodeRepo;
