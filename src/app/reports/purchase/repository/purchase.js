const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
// const { PURCHASE_MST,
//     PURCHASE_MST_PONUM,
//     PURCHASE_DETAILS,
//     PARTYLEDGER,
//     STOCKLEDGER,
//     PURCHASERETURNMASTER,
//     PURCHASERETURNDETAIL, PURCHASE_MST_TEMP,
//     PURCHASE_DETAILS_TEMP } = require("../../../purchase/commons");
const {
    MAIN_CATEGORY,
    SUB_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { ITEM, HEADS, TYPEDESIGN, SUPPLIER } = require("../../../catalog/commons");

function purchaseRepo(fastify) {
    async function getPurchaseReport({ body, params, logTrace }) {
        const knex = this;
        console.log("12345678");
        const { customer, from_date, to_date } = body


        const query = knex
            .select([
                `${PURCHASE_MST.NAME}.*`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PINCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.EMAIL}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.WEBSITE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANKNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IFSCCODE}`,
                `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
                `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
            ])
            .from(`${PURCHASE_MST.NAME} as ${PURCHASE_MST.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .whereRaw(
                `DATE(${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.DOCDATE}) >= ?`,
                [from_date]
            )
            .whereRaw(
                `DATE(${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.DOCDATE}) <= ?`,
                [to_date]
            );

        if (Number(customer) && Number(customer) !== 0) {
            query.where(
                `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
                Number(customer)
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Purchase",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const purchasedetails = await Promise.all(
            response.map(async purchase => {
                const purchase_lines = await knex
                    .select([
                        `${PURCHASE_DETAILS.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
                    ])
                    .from(`${PURCHASE_DETAILS.NAME} as ${PURCHASE_DETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PROD_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${HEADS.NAME} as ${HEADS.NAME}`,
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.HEAD_ID}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.TYPE_ID}`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.CAT_ID}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.SUBCAT_ID}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
                    )
                    .where(
                        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PURMST_ID}`,
                        purchase.id
                    );

                const po_details = await knex
                    .select([
                        `${PURCHASE_MST_PONUM.NAME}.*`,

                    ])
                    .from(`${PURCHASE_MST_PONUM.NAME} as ${PURCHASE_MST_PONUM.NAME}`)

                    .where(
                        `${PURCHASE_MST_PONUM.NAME}.${PURCHASE_MST_PONUM.COLUMNS.DOCNO}`,
                        purchase.docno
                    );

                return { ...purchase, purchase_lines, po_details };
            })
        );

        return purchasedetails;
    }
    async function deletePurchaseReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex
            .select([
                `${PURCHASE_MST_TEMP.NAME}.*`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PINCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.EMAIL}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.WEBSITE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANKNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IFSCCODE}`,
                `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
                `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
            ])
            .from(`${PURCHASE_MST_TEMP.NAME} as ${PURCHASE_MST_TEMP.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${PURCHASE_MST_TEMP.NAME}.${PURCHASE_MST_TEMP.COLUMNS.PARTYCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .whereRaw(
                `DATE(${PURCHASE_MST_TEMP.NAME}.${PURCHASE_MST_TEMP.COLUMNS.DOCDATE}) >= ?`,
                [body.from_date]
            )
            .whereRaw(
                `DATE(${PURCHASE_MST_TEMP.NAME}.${PURCHASE_MST_TEMP.COLUMNS.DOCDATE}) <= ?`,
                [body.to_date]
            )
            .orderBy(`${PURCHASE_MST_TEMP.NAME}.${PURCHASE_MST_TEMP.COLUMNS.ID}`, "DESC");


        if (body.customer && body.customer !== 0) {
            query.where(
                `${PURCHASE_MST_TEMP.NAME}.${PURCHASE_MST_TEMP.COLUMNS.PARTYCODE}`,
                body.customer
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Purchase",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const purchasedetails = await Promise.all(
            response.map(async purchase => {
                const purchase_lines = await knex
                    .select([
                        `${PURCHASE_DETAILS_TEMP.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
                    ])
                    .from(`${PURCHASE_DETAILS_TEMP.NAME} as ${PURCHASE_DETAILS_TEMP.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.PROD_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${HEADS.NAME} as ${HEADS.NAME}`,
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.HEAD_ID}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.TYPE_ID}`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.CAT_ID}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.SUBCAT_ID}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
                    )
                    .where(
                        `${PURCHASE_DETAILS_TEMP.NAME}.${PURCHASE_DETAILS_TEMP.COLUMNS.PURMST_ID}`,
                        purchase.id
                    );


                return { ...purchase, purchase_lines };
            })
        );

        return purchasedetails;
    }
    async function getPurchaseReturnReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex
            .select([
                `${PURCHASERETURNMASTER.NAME}.*`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PINCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.EMAIL}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.WEBSITE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANKNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IFSCCODE}`,
                `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
                `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
            ])
            .from(`${PURCHASERETURNMASTER.NAME} as ${PURCHASERETURNMASTER.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.PARTYCODE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .whereRaw(
                `DATE(${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.DOCDATE}) >= ?`,
                [body.from_date]
            )
            .whereRaw(
                `DATE(${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.DOCDATE}) <= ?`,
                [body.to_date]
            );

        // Conditionally add filters based on provided parameters
        if (body.customer && body.customer !== 0) {
            query.where(
                `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.PARTYCODE}`,
                body.customer
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Purchase",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const purchasedetails = await Promise.all(
            response.map(async purchase => {
                const purchase_lines = await knex
                    .select([
                        `${PURCHASERETURNDETAIL.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
                    ])
                    .from(`${PURCHASERETURNDETAIL.NAME} as ${PURCHASERETURNDETAIL.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.PROD_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${HEADS.NAME} as ${HEADS.NAME}`,
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.HEAD_ID}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.TYPE_ID}`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.CAT_ID}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.SUBCAT_ID}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
                    )
                    .where(
                        `${PURCHASERETURNDETAIL.NAME}.${PURCHASERETURNDETAIL.COLUMNS.PRMST_ID}`,
                        purchase.id
                    );


                return { ...purchase, purchase_lines };
            })
        );

        return purchasedetails;
    }


    return {
        getPurchaseReport,
        deletePurchaseReport,
        getPurchaseReturnReport
    };
}

module.exports = purchaseRepo;
