const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MISSING_STOCKS } = require("../../../closing_stock _outlet/commons");

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
const { STOCKMISSINGMST, STOCKMISSINGMSTDETAILS, STOCKLEDGER, OUTLETSTOCKLEDGER, STOCK_VERIFY_SETTING } = require("../../../../../src/app/stock_verify/commons");

function stockMissingRepo(fastify) {
    async function getstockMissingReport({ body, params, logTrace }) {
        const knex = this;

        const query = knex
            .select([
                `${STOCKMISSINGMST.NAME}.*`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PINCODE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FSSAI}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKACNO}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKNAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ACNAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IFSCCODE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ISGST}`,
                `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
                `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
                `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
            ])
            .from(`${STOCKMISSINGMST.NAME} as ${STOCKMISSINGMST.NAME}`)
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${STOCKMISSINGMST.NAME}.${STOCKMISSINGMST.COLUMNS.PARTYCODE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
                `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
            )
            .whereRaw(
                `DATE(${STOCKMISSINGMST.NAME}.${STOCKMISSINGMST.COLUMNS.DOCDATE}) >= ?`,
                [body.from_date]
            )
            .whereRaw(
                `DATE(${STOCKMISSINGMST.NAME}.${STOCKMISSINGMST.COLUMNS.DOCDATE}) <= ?`,
                [body.to_date]
            );

        // Conditionally add filters based on provided parameters
        if (body.customer && body.customer !== 0) {
            query.where(
                `${STOCKMISSINGMST.NAME}.${STOCKMISSINGMST.COLUMNS.PARTYCODE}`,
                body.customer
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Stock Missing Report",
            logTrace
        });
        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Stock Missing data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const purchasedetails = await Promise.all(
            response.map(async purchase => {
                const stock_missing_lines = await knex
                    .select([
                        `${STOCKMISSINGMSTDETAILS.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
                    ])
                    .from(`${STOCKMISSINGMSTDETAILS.NAME} as ${STOCKMISSINGMSTDETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.PRODID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${HEADS.NAME} as ${HEADS.NAME}`,
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.HEAD_ID}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.TYPE_ID}`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.CAT_ID}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.SUBCAT_ID}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
                    )
                    .where(
                        `${STOCKMISSINGMSTDETAILS.NAME}.${STOCKMISSINGMSTDETAILS.COLUMNS.STOCK_MISSING_MST_ID}`,
                        purchase.id
                    );


                return { ...purchase, stock_missing_lines };
            })
        );

        return purchasedetails;


    }

    async function getstockMissingNewReport({ body, params, logTrace }) {
        const knex = this;

        const query = knex
            // .distinct([`${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.BARCODE}`])
            .select([
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.ID}`,
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.DOCDATE}`,
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.BARCODE}`,
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.MRP}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
            ])
            .from(`${MISSING_STOCKS.NAME} as ${MISSING_STOCKS.NAME}`)
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.PRODID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
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
            .whereRaw(
                `DATE(${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.DOCDATE}) >= ?`,
                [body.from_date]
            )
            .whereRaw(
                `DATE(${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.DOCDATE}) <= ?`,
                [body.to_date]
            )
            .where(
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.IS_REACTIVATE}`,
                false
            )
            .orderBy(MISSING_STOCKS.COLUMNS.ID, 'desc')


        if (body.customer && body.customer !== 0) {
            query.where(
                `${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.OUTLET_ID}`,
                body.customer
            );
        }

        if (body.search && body.search.length >= 1) {
            query
                .where(function () {
                    this.where(`${MISSING_STOCKS.NAME}.${MISSING_STOCKS.COLUMNS.BARCODE}`, "ilike", `%${body.search}%`)
                        .orWhere(`${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${body.search}%`)
                        .orWhere(`${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`, "ilike", `%${body.search}%`);
                });
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Stock Missing Report",
            logTrace
        });
        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Stock Missing data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const uniqueReport = response.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.barcode === item.barcode)
        )

        return uniqueReport;
    }



    return {
        getstockMissingReport,
        getstockMissingNewReport
    };
}

module.exports = stockMissingRepo;
