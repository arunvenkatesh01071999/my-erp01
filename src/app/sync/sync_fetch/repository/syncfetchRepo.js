const axios = require('axios');
const cron = require('node-cron');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MAIN_CATEGORY, RE_DETAILS } = require("../commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { HEADS } = require("../../../catalog/heads/commons/constants");
const { TYPEDESIGN } = require("../../../catalog/typedesign/commons/constants");
const { MERCHANT_CATEGORY } = require("../../../catalog/merchantcategory/commons/constants");
const { ITEM, CUSTOMER } = require("../../../catalog/item/commons/constants");
const { OUTLET_PRODUCT_MAPPING, BARCODE_LIST, SUPPLIER, ITEM_EDIT, ITEM_SETTING } = require('../../../catalog/commons');
const { SUB_CATEGORY, BRANDS } = require('../../../catalog/category/commons/constants');
const { OUTLETS } = require('../../../accounts/outlets/commons/constants');
const { SUPPLIER_OUTLET_MAPPING } = require('../../../catalog/supplier/commons/constants');
const { STATES, COUNTRIES, CITIES } = require('../../../masterData/commons/constants');
const { OUTLET_PO_MASTER, OUTLET_PO_DETAILS } = require('../../../outlet_po/Outlet_po_manual/commons/constants');
const { OUTLET_PURCHASE_MASTER, OUTLET_PURCHASE_DETAILS, OUTLET_PURCHASE_BATCH_DETAILS, OUTLET_PURCHASE_RETURN_MASTER, OUTLET_PURCHASE_RETURN_DETAILS, OUTLET_DEBIT_NOTE_MASTER, OUTLET_DEBIT_NOTE_DETAILS } = require('../../../outlet_purchase/commons/constants');
const { SALES_FMCG_MASTER, SALES_FMCG_DETAILS } = require("../../../sales/sales_fmcg_master/commons/constants")
const { WAREHOUSE } = require("../../../catalog/warehouse/commons/constants");
const { SALES_RETURN_MASTER, SALES_RETURN_DETAILS } = require("../../../sales/sales_fmcg_return/commons/constants")
function categoryRepo(fastify) {
    async function getBrandSyncDetails({ company_id, logTrace, query, params }) {
        const knex = this;
        const { id } = params;
        const { timestamp } = query;

        let dbQuery = knex(HEADS.NAME)
            .andWhere(HEADS.COLUMNS.IS_INSERTED, false)
            .andWhere(HEADS.COLUMNS.ID, '>', id)

        if (timestamp) {
            dbQuery = dbQuery.where((builder) => {
                builder
                    .where(HEADS.COLUMNS.CREATED_AT, ">", timestamp)
                    .orWhere(HEADS.COLUMNS.UPDATED_AT, ">", timestamp);
            });
        }

        logQuery({
            logger: fastify.log,
            query: dbQuery,  // Fixed variable name
            context: "Get heads",
            logTrace
        });

        const response = await dbQuery;
        if (!response.length) {
            return {
                status: 0,
                message: "Brand not found"
            }
        }
        return response;
    }

    async function getUnitsSync({ logTrace, query, params }) {
        const knex = this;
        const { timestamp } = query;
        const { id } = params;
        let dbQuery = knex(UNITS.NAME)
            .where(UNITS.COLUMNS.IS_INSERTED, false)
            .andWhere(UNITS.COLUMNS.ID, ">", id)
            .orderBy(UNITS.COLUMNS.ID, 'asc')

        if (timestamp) {
            console.log("true")
            dbQuery = dbQuery.where((builder) => {
                builder
                    .where(UNITS.COLUMNS.CREATED_AT, ">", String(timestamp))
                    .orWhere(UNITS.COLUMNS.UPDATED_AT, ">", String(timestamp));
            });
        }

        logQuery({
            logger: fastify.log,
            query: dbQuery,
            context: "Get units",
            logTrace
        });

        const response = await dbQuery;
        if (!response.length) {
            return {
                status: 0,
                message: "Units not found"
            }
        }
        return response;
    }


    async function getBrandCompanySyncDetails({ company_id, logTrace, query, params }) {
        const knex = this;
        const { timestamp } = query;
        const { id } = params;
        let query1 = knex(TYPEDESIGN.NAME)
            .where(TYPEDESIGN.COLUMNS.IS_INSERTED, false)
            .andWhere(TYPEDESIGN.COLUMNS.ID, '>', id)
            .orderBy(TYPEDESIGN.COLUMNS.ID, 'asc')

        if (company_id) {
            query1 = query1.where(TYPEDESIGN.COLUMNS.COMPANY_ID, company_id);
        }

        if (timestamp) {
            console.log("Timestamp provided:", timestamp);
            query1 = query1.where((builder) => {
                builder
                    .where(TYPEDESIGN.COLUMNS.CREATED_AT, ">", timestamp)
                    .orWhere(TYPEDESIGN.COLUMNS.UPDATED_AT, ">", timestamp);
            });
        }

        logQuery({
            logger: fastify.log,
            query: query1,  // Fixed variable reference
            context: "Get typedesign",
            logTrace
        });

        const response = await query1; // Fixed incorrect variable usage
        if (!response.length) {
            return {
                status: 0,
                message: "Brand Company not found"
            }
        }
        return response;
    }


    async function getMerchantCategorySyncDetails({ company_id, logTrace, query, params }) {
        const knex = this;
        const { timestamp } = query;
        const { id } = params;

        let dbQuery = knex(MERCHANT_CATEGORY.NAME)
            .where(MERCHANT_CATEGORY.COLUMNS.IS_INSERTED, false)
            .andWhere(MERCHANT_CATEGORY.COLUMNS.ID, '>', id)

        if (timestamp) {
            console.log("Timestamp provided:", timestamp);
            dbQuery = dbQuery.where((builder) => {
                builder
                    .where(MERCHANT_CATEGORY.COLUMNS.CREATED_AT, ">", timestamp)
                    .orWhere(MERCHANT_CATEGORY.COLUMNS.UPDATED_AT, ">", timestamp);
            });
        }

        logQuery({
            logger: fastify.log,
            query: dbQuery,  // Fixed variable reference
            context: "Get merchant category",
            logTrace
        });

        const response = await dbQuery; // Fixed incorrect variable usage
        if (!response.length) {
            return {
                status: 0,
                message: "Merchant Category not found"
            }
        }
        return response;
    }

    async function getCategorySyncDetails({ logTrace, query, params }) {
        const knex = this;
        const { timestamp } = query;
        const { id } = params;

        // --- MAIN CATEGORY QUERY ---
        let mainQuery = knex(MAIN_CATEGORY.NAME)
            .select("*")
            .where(MAIN_CATEGORY.COLUMNS.IS_INSERTED, false)
            .where(MAIN_CATEGORY.COLUMNS.ID, ">", id);

        if (timestamp) {
            mainQuery = mainQuery.where((builder) => {
                builder
                    .where(MAIN_CATEGORY.COLUMNS.CREATED_AT, ">", timestamp)
                    .orWhere(MAIN_CATEGORY.COLUMNS.UPDATED_AT, ">", timestamp);
            });
        }

        const mainCategories = await mainQuery;

        // --- SUB CATEGORY QUERY ---
        let subQuery = knex(SUB_CATEGORY.NAME)
            .select(
                `${SUB_CATEGORY.COLUMNS.ID}`,
                `${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as category_name`,
                `${SUB_CATEGORY.COLUMNS.CATEGORY_ID} as category_id`,
                `${SUB_CATEGORY.COLUMNS.IS_ACTIVE}`
            )
            .where(SUB_CATEGORY.COLUMNS.IS_INSERTED, false)
            .where(SUB_CATEGORY.COLUMNS.ID, ">", id);

        if (timestamp) {
            subQuery = subQuery.where((builder) => {
                builder
                    .where(SUB_CATEGORY.COLUMNS.CREATED_AT, ">", timestamp)
                    .orWhere(SUB_CATEGORY.COLUMNS.UPDATED_AT, ">", timestamp);
            });
        }

        const subCategories = await subQuery;

        // --- Check if both empty ---
        if (!mainCategories.length && !subCategories.length) {
            return {
                status: 0,
                message: "Category not found",
            };
        }

        // --- Add identifiers ---
        const formattedMain = mainCategories.map((cat) => ({
            ...cat,
            CM_Parent: 1,
            category_type: "MAIN_CATEGORY",
        }));

        const formattedSub = subCategories.map((cat) => ({
            ...cat,
            CM_Parent: cat.category_id,
            category_type: "SUB_CATEGORY",
        }));

        // --- Merge and sort ---
        const merged = [...formattedMain, ...formattedSub].sort(
            (a, b) => a.id - b.id // or use new Date(a.updated_at) - new Date(b.updated_at)
        );

        // --- Return unified response ---
        return merged;
    }


    async function getItemDeleteDetails({ logTrace }) {
        const knex = this;
        const query = knex(ITEM.NAME)
            .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as pro_code`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
            )
            .leftJoin(
                `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .where(ITEM.COLUMNS.IS_ACTIVE, true);

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Category",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Item Details not found"
            }
        }
        return response;
    }


    async function getCategoryEditSyncDetails({ logTrace, params }) {
        const knex = this;
        const { outlet_id } = params;
        // --- MAIN CATEGORY QUERY ---
        let mainQuery = knex(MAIN_CATEGORY.NAME)
            .distinct(
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as category_name`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.IS_ACTIVE}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                ITEM.NAME,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`
            )
            .leftJoin(
                OUTLET_PRODUCT_MAPPING.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .where(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

        logQuery({
            logger: fastify.log,
            query: mainQuery,
            context: "Get Main Category",
            logTrace
        });

        const mainCategories = await mainQuery;

        // --- SUB CATEGORY QUERY ---
        let subQuery = knex(SUB_CATEGORY.NAME)
            .distinct(
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as category_name`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID} as category_id`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_ACTIVE}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                ITEM.NAME,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`
            )
            .leftJoin(
                OUTLET_PRODUCT_MAPPING.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .where(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

        logQuery({
            logger: fastify.log,
            query: mainQuery,
            context: "Get SubCategory",
            logTrace
        });

        const subCategories = await subQuery;

        // --- Check if both empty ---
        if (!mainCategories.length && !subCategories.length) {
            return {
                status: 0,
                message: "Category not found",
            };
        }

        // --- Add identifiers ---
        const formattedMain = mainCategories.map((cat) => ({
            ...cat,
            CM_Parent: 1,
            category_type: "MAIN_CATEGORY",
        }));

        const formattedSub = subCategories.map((cat) => ({
            ...cat,
            CM_Parent: cat.category_id,
            category_type: "SUB_CATEGORY",
        }));

        // --- Merge and sort ---
        const merged = [...formattedMain, ...formattedSub].sort(
            (a, b) => a.id - b.id // or use new Date(a.updated_at) - new Date(b.updated_at)
        );

        // --- Return unified response ---
        return merged;
    }

    async function getBrandEditSyncDetails({ params, logTrace, body }) {
        const knex = this;
        const { outlet_id } = params;
        const query = knex(HEADS.NAME)
            .distinct(
                `${HEADS.NAME}.${HEADS.COLUMNS.ID} as brand_id`,
                `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as brand_name`,
                `${HEADS.NAME}.${HEADS.COLUMNS.IS_ACTIVE}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                ITEM.NAME,
                `${HEADS.NAME}.${HEADS.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`
            )
            .leftJoin(
                OUTLET_PRODUCT_MAPPING.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .where(`${HEADS.NAME}.${HEADS.COLUMNS.IS_INSERTED}`, false)
            .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
            .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Brand",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Brand not found"
            }
        }
        return response;
    }


    async function getMerchantCategoryEditDetails({ params, logTrace, body }) {
        const knex = this;
        const { outlet_id } = params;
        const query = knex(MERCHANT_CATEGORY.NAME)
            .distinct(
                `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID} as category_id`,
                `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME} as category_name`,
                `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.IS_ACTIVE}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                ITEM.NAME,
                `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MERCHANT_CATEGORY_ID}`
            )
            .leftJoin(
                OUTLET_PRODUCT_MAPPING.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .where(`${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Merchant Category",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Merchant Category not found"
            }
        }
        return response;
    }

    async function getBrandCompanyEditSyncDetails({ params, logTrace, body }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex(TYPEDESIGN.NAME)
            .distinct(
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`
            )
            .leftJoin(
                ITEM.NAME,
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`
            )
            .leftJoin(
                OUTLET_PRODUCT_MAPPING.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .leftJoin(
                OUTLETS.NAME,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Brand Company",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Brand Company not found"
            }
        }
        return response;
    }

    async function getItemBarcodeSyncDetails({ params, logTrace, userDetails }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex(ITEM_EDIT.NAME)
            .select(
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID} as product_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_CODE} as product_code`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE1} as barcode1`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE2} as barcode2`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE3} as barcode3`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE4} as barcode4`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.UPDATED_AT} as edit_time`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CREATED_BY} as user_id`
            )
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
            )
            .leftJoin(
                `${ITEM_SETTING.NAME} as ${ITEM_SETTING.NAME}`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.OUTLET_PRODUCT_ID}`
            )
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.LOCATION_ID}`, outlet_id)


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Barcode",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Barcode not found"
            }

        }
        return response;
    }

    async function getItemSettingSyncDetails({ logTrace, params }) {
        const knex = this;
        const { outlet_id } = params;
        const query = knex(ITEM_SETTING.NAME)
            .select(
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.LOC_ID} as outlet_id`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.OUTLET_PRODUCT_ID} as product_id`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.PRO_CODE} as product_code`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.S_ACTIVE} as sales_active`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.P_ACTIVE} as purchase_active`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.STATUS}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.EDATE}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.ETIME}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.P_MARGIN}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.BARCODE_ONE} as barcode1`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.BARCODE_TWO} as barcode2`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.BARCODE_THREE}  as barcode3`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.STABARCODE_FOUR} as barcode4`,
            )
            .where(`${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.LOC_ID}`, outlet_id)


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Item Setting",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Item Setting not found"
            }
        }
        return response;
    }


    async function getProductMasterSyncDetails({ logTrace, userDetails, params }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex(ITEM_EDIT.NAME)
            .distinct(
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID} as product_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_CODE} as product_code`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_NAME} as product_name`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.SUB_CATEGORY_ID} as sub_category_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.UOM_ID} as uom_id`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
                `${ITEM.NAME}.${ITEM.COLUMNS.REGIONAL_NAME} as native_name`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE1} as barcode1`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BATCH_ITEM} as batch_item`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BRAND_ID} as brand_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.GST} as gst`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CREATED_BY} as user_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CREATED_AT} as create_time`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.IS_ACTIVE} as is_active`,
                `${ITEM.NAME}.${ITEM.COLUMNS.WSCALE} as wscale`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.LOCATION_ID} as outlet_id`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.P_ACTIVE} as purchase`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.MERCHANT_CATEGORY_ID} as mc_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.HSN} as hsn`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE2} as barcode2`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE3} as barcode3`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE4} as barcode4`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CESS} as cess`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.UPDATED_AT} as edit_time`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BRAND_COMPANY_ID} as bc_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_TYPE_ID} as type_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.MODE} as mode`
            )
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
            )
            .leftJoin(
                `${ITEM_SETTING.NAME} as ${ITEM_SETTING.NAME}`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.OUTLET_PRODUCT_ID}`
            )
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.LOCATION_ID}`, outlet_id)
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.MODE}`, 0)


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Product Details",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Product Details not found"
            }
        }
        return response;
    }

    async function getProductMasterEditSyncDetails({ logTrace, params }) {
        const knex = this;
        const { outlet_id } = params;
        const query = knex(ITEM_EDIT.NAME)
            .distinct(
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID} as product_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_CODE} as product_code`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_NAME} as product_name`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.SUB_CATEGORY_ID} as sub_category_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.UOM_ID} as uom_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_NAME} as product_name`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.SALE_RATE} as sale_rate`,
                `${'opm'}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as wscale`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_NAME} as native_name`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE} as barcode`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE1} as barcode1`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BATCH_ITEM} as batch_item`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BRAND_ID} as brand_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.GST} as gst`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CREATED_BY} as user_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CREATED_AT} as create_time`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.IS_ACTIVE} as is_active`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.LOCATION_ID} as outlet_id`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.P_ACTIVE} as purchase`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.MERCHANT_CATEGORY_ID} as mc_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.HSN} as hsn`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE2} as barcode2`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE3} as barcode3`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BARCODE4} as barcode4`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.CESS} as cess`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.UPDATED_AT} as edit_time`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.BRAND_COMPANY_ID} as bc_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.PRODUCT_TYPE_ID} as type_id`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.MODE} as mode`
            )
            .leftJoin(
                `${OUTLET_PRODUCT_MAPPING.NAME} as opm`,
                function () {
                    this.on(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID}`, '=', `opm.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`)
                        .andOn(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.LOCATION_ID}`, '=', `opm.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`);
                }
            )
            .leftJoin(
                `${ITEM_SETTING.NAME} as ${ITEM_SETTING.NAME}`,
                `${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID}`,
                `${ITEM_SETTING.NAME}.${ITEM_SETTING.COLUMNS.OUTLET_PRODUCT_ID}`
            )
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.IS_INSERTED}`, false)
            .where(`${ITEM_EDIT.NAME}.${ITEM_EDIT.COLUMNS.LOCATION_ID}`, outlet_id);

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Product Details",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            return {
                status: 0,
                message: "Product Details not found"
            }
        }
        return response;
    }


    async function putProductSyncDetails({ body, params, logTrace, query, userDetails }) {
        const knex = this;
        const current_time = new Date();

        const updateData = {
            [ITEM.COLUMNS.IS_INSERTED]: true,
            [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
            [ITEM.COLUMNS.UPDATED_AT]: current_time
        };

        if (
            !Array.isArray(body.pro_code) ||
            body.pro_code.some(item => typeof item.pro_code !== 'number' && typeof item.pro_code !== 'string')
        ) {
            throw CustomError.create({
                httpCode: 400,
                message: "pro_code must be an array of objects with a 'pro_code' key",
                code: "INVALID_INPUT"
            });
        }

        const productCodes = body.pro_code.map(item => item.pro_code);

        const updated = await knex(ITEM.NAME)
            .whereIn(ITEM.COLUMNS.PRODUCT_CODE, productCodes)
            .update(updateData);

        if (updated === 0) {
            throw CustomError.create({
                httpCode: 404,
                message: "Mapping SYNC not found",
                code: "NOT_FOUND"
            });
        }

        return { status: true };
    }


    async function getSuplierOutletMappingDetailsRepo({ body, params, logTrace, queryString }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex
            .select([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} as new_code`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO} as old_code`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE} as customer_code`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN} as tn_gstin`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.LOCAL_SUPPLIER_MAPPING} as local_supplier_mapping`
            ])
            .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where({
                [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`]: outlet_id,
                [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
                [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.LOCAL_SUPPLIER_MAPPING}`]: false,
                [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`]: true
            })
            .orderBy(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`, "ASC");


        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Supplier mapping not found for the given outlet",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function putSuplierOutletMappingDetailsRepo({ body, params, logTrace, queryString }) {
        const knex = this;
        const { outlet_id, local_supplier_mapping } = params;

        await knex(SUPPLIER_OUTLET_MAPPING.NAME)
            .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
            .update({
                [SUPPLIER_OUTLET_MAPPING.COLUMNS.LOCAL_SUPPLIER_MAPPING]: local_supplier_mapping,
                [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: 1,
                [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: new Date()
            });

        return { success: true };

    }

    async function getSuplierInsertUpdateDetailsRepo({ body, params, logTrace, queryString }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex
            .select([
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE} as customer_code`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} as new_code`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO} as old_code`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1} as address1`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2} as address2`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
                `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
                `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE} as pincode`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE} as phone_no`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL} as email_id`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE} as mobile`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`

            ])
            .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .leftJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .leftJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .where({
                [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`]: outlet_id,
                [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
                [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ACTION_FLAG}`]: false,
                [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`]: true
            })
            .orderBy(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`, "ASC");


        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Supplier mapping not found for the given outlet",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function putSyncSupplierFlagUpdateRepo({ body, params }) {
        const knex = this;
        const { outlet_id } = params;
        const { outlet_supplier_details } = body;

        const supplierCodes = outlet_supplier_details.map(d => d.supplier_code);

        // Build CASE WHEN string
        const cases = outlet_supplier_details.map(
            ({ supplier_code, action_flag }) =>
                `WHEN '${supplier_code}' THEN ${action_flag ? 'true' : 'false'}`
        ).join(" ");

        await knex.transaction(async (trx) => {
            await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE, supplierCodes)
                .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
                .update({
                    [SUPPLIER_OUTLET_MAPPING.COLUMNS.ACTION_FLAG]: trx.raw(
                        `CASE ${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} ${cases} END`
                    ),
                    [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: 1,
                    [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: new Date()
                });
        });

        return { success: true };
    }


    async function getSyncOutletPoDetailsRepo({ body, params, logTrace, queryString }) {
        const knex = this;
        const { outlet_id } = params;

        // 🔹 Fetch all PO masters for the outlet
        const poMasters = await knex
            .select([
                `${OUTLET_PO_MASTER.NAME}.*`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE} as po_type`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_address1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_address2`
            ])
            .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where({
                [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`]: outlet_id,
                [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRED}`]: false,
            })
            .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "ASC");

        // 🔹 If no master found
        if (!poMasters.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase Order Details was not found",
                code: "NOT_FOUND",
            });
        }

        // 🔹 Collect all master ids
        const masterIds = poMasters.map(po => po.id);

        // 🔹 Fetch all details in one query instead of looping
        const poDetails = await knex
            .select([`${OUTLET_PO_DETAILS.NAME}.*`])
            .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
            .whereIn(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`, masterIds)
            .orderBy(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`, "ASC");

        // 🔹 Group details by master_id
        const detailsByMaster = poDetails.reduce((acc, detail) => {
            if (!acc[detail.outlet_po_master_id]) {
                acc[detail.outlet_po_master_id] = [];
            }
            acc[detail.outlet_po_master_id].push(detail);
            return acc;
        }, {});

        // 🔹 Merge master with details
        const purchaseOrderDetails = poMasters.map(po => ({
            ...po,
            po_details_lines: detailsByMaster[po.id] || [],
        }));

        return purchaseOrderDetails;
    }

    // async function getReDetailsRepo({ params, query, logTrace }) {
    //     const knex = this;
    //     const { tr_id, loc_id, tr_date } = params;

    //     const dbQuery = knex
    //         .select([
    //             `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.TR_ID} as trid`,
    //             `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.PRO_ID} as prodid`,
    //             `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.RATE} as rate`,
    //             `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.ONLINE_RATE} as onlinerate`,
    //             knex.raw(`TO_CHAR(${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.CREATED_AT}, 'YYYY-MM-DD') as tr_date`),
    //             knex.raw(`TO_CHAR(${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.CREATED_AT}, 'YYYY-MM-DD HH24:MI:SS') as tr_time`)
    //         ])
    //         .from(`${RE_DETAILS.NAME} as ${RE_DETAILS.NAME}`)
    //         .whereRaw(`DATE(${RE_DETAILS.COLUMNS.CREATED_AT}) = ?`, [tr_date])
    //         .andWhere(RE_DETAILS.COLUMNS.TR_ID, ">=", tr_id)
    //         .andWhere(RE_DETAILS.COLUMNS.STATUS, 0)
    //         .andWhere(RE_DETAILS.COLUMNS.LOC_ID, loc_id)
    //         .andWhere(RE_DETAILS.COLUMNS.CLIENTID, 1)
    //         .orderBy(RE_DETAILS.COLUMNS.ID, "desc");

    //     logQuery({
    //         logger: fastify.log,
    //         query: dbQuery,
    //         context: "Get rate entry details",
    //         logTrace
    //     });

    //     const response = await dbQuery;

    //     return response;
    // }

    async function getReDetailsRepo({ params, query, logTrace }) {
        const knex = this;
        const { tr_id, loc_id, tr_date } = params;

        const dbQuery = knex
            .select([
                `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.TR_ID} as trid`,
                `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.PRO_ID} as prodid`,
                `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.RATE} as rate`,
                `${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.ONLINE_RATE} as onlinerate`,

                // Convert UTC --> IST for date & datetime
                knex.raw(
                    `TO_CHAR(${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.CREATED_AT} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') as tr_date`
                ),
                knex.raw(
                    `TO_CHAR(${RE_DETAILS.NAME}.${RE_DETAILS.COLUMNS.CREATED_AT} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD HH24:MI:SS') as tr_time`
                )
            ])
            .from(`${RE_DETAILS.NAME} as ${RE_DETAILS.NAME}`)

            // 🔥 FIXED: Compare IST date with input date
            .whereRaw(
                `DATE(${RE_DETAILS.COLUMNS.CREATED_AT} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = ?`,
                [tr_date]
            )

            .andWhere(RE_DETAILS.COLUMNS.TR_ID, ">=", tr_id)
            .andWhere(RE_DETAILS.COLUMNS.STATUS, 0)
            .andWhere(RE_DETAILS.COLUMNS.LOC_ID, loc_id)
            .andWhere(RE_DETAILS.COLUMNS.CLIENTID, 1)
            .orderBy(RE_DETAILS.COLUMNS.ID, "desc");

        logQuery({
            logger: fastify.log,
            query: dbQuery,
            context: "Get rate entry details",
            logTrace
        });

        const response = await dbQuery;
        return response;
    }


    async function updateReDetailsRepo({ body, logTrace, params }) {
        const knex = this;
        const { tr_id } = params;
        const { loc_id, pro_id, tr_date } = body;

        const dbQuery = knex(RE_DETAILS.NAME)
            .update({
                [RE_DETAILS.COLUMNS.STATUS]: 1,
                [RE_DETAILS.COLUMNS.UPDATED_AT]: new Date()
            })
            // 🔥 FIXED: Compare IST date with input date
            .whereRaw(
                `DATE(${RE_DETAILS.COLUMNS.CREATED_AT} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = ?`,
                [tr_date]
            )
            .andWhere(RE_DETAILS.COLUMNS.TR_ID, tr_id)
            .andWhere(RE_DETAILS.COLUMNS.STATUS, 0)
            .andWhere(RE_DETAILS.COLUMNS.LOC_ID, loc_id)
            .andWhere(RE_DETAILS.COLUMNS.PRO_ID, pro_id);

        logQuery({
            logger: fastify.log,
            query: dbQuery,
            context: "Update rate entry details",
            logTrace,
        });

        const affectedRows = await dbQuery;

        if (affectedRows === 0) {
            return {
                status: 0,
                message: "No matching record found or already updated",
            };
        }

        return {
            status: 1,
            message: "Rate entry detail(s) updated successfully",
        };

    }

    async function getpoSyncPaginate({ params, body, logTrace }) {

        const knex = this;
        const { flag, outlet_id } = params;
        const response = await knex.transaction(async trx => {

            // 1. Fetch latest PO master
            const master = await trx(OUTLET_PO_MASTER.NAME)
                .select(
                    `${OUTLET_PO_MASTER.NAME}.*`,
                    knex.raw(
                        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}::TEXT AS po_no`
                    ),
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} AS supplier_customer_code`,
                    knex.raw(
                        `TO_CHAR(${OUTLET_PO_MASTER.NAME}.po_date, 'YYYY-MM-DD') AS po_date`
                    )
                )
                .leftJoin(
                    SUPPLIER_OUTLET_MAPPING.NAME,
                    `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
                )
                .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_SYNC}`, flag)
                .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 1)
                .where(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
                .orderByRaw(
                    `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}::INTEGER ASC`
                )
                .first();

            if (!master) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "PO data not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            console.log("masterResponse", master)

            const poNo = master.po_no;

            // 2. Fetch all PO details (no pagination)
            const details = await knex(OUTLET_PO_DETAILS.NAME)
                .select(
                    `${OUTLET_PO_DETAILS.NAME}.*`,
                    knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.created_at, 'YYYY-MM-DD') AS created_at`),
                    knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.updated_at, 'YYYY-MM-DD') AS updated_at`),
                    knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.po_date, 'YYYY-MM-DD') AS po_date`)
                )
                .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, poNo)
                .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_SYNC}`, flag)
                .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY}`, ">", 0)
                .orderBy("id", "asc");

            return {
                po_no: poNo,
                master,
                details
            };
        });

        return response;
    }

    async function putOutletPOSyncRepo({ params, body, userDetails }) {
        const knex = this;
        const { po_no, outlet_id } = params;
        const { flag, outlet_po_no } = body;

        const trx = await knex.transaction();

        try {
            const existingPOMaster = await trx(OUTLET_PO_MASTER.NAME)
                .select(
                    OUTLET_PO_MASTER.COLUMNS.ID,
                    OUTLET_PO_MASTER.COLUMNS.PO_NO,
                    OUTLET_PO_MASTER.COLUMNS.OUTLET_ID
                )
                .where({
                    [OUTLET_PO_MASTER.COLUMNS.PO_NO]: String(po_no),
                    [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: 0
                })
                .first();

            if (!existingPOMaster?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No Records Found in PO Master (Check PO Details)",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const poMasterId = existingPOMaster.id;

            const poDetails = await trx(OUTLET_PO_DETAILS.NAME)
                .select(OUTLET_PO_DETAILS.COLUMNS.ID)
                .where({
                    [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
                    [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: 0
                });

            if (!poDetails || poDetails.length === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No PO Details Found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const currentTime = new Date();

            // 3️⃣ Update po_details first (bulk update)
            const updateDetails = await trx(OUTLET_PO_DETAILS.NAME)
                .where({
                    [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
                    [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: 0
                })
                .update({
                    [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: flag,
                    [OUTLET_PO_DETAILS.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateDetails === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update PO Details",
                    property: "",
                    code: "DETAILS_UPDATE_FAILED"
                });
            }

            // 4️⃣ Update master only after details update
            const updateMaster = await trx(OUTLET_PO_MASTER.NAME)
                .where({
                    [OUTLET_PO_MASTER.COLUMNS.ID]: poMasterId,
                    [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
                    [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: 0
                })
                .update({
                    [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: flag,
                    [OUTLET_PO_MASTER.COLUMNS.OUTLET_PO_NO]: outlet_po_no,
                    [OUTLET_PO_MASTER.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateMaster === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Failed to update PO Master",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            await trx.commit();

            return { success: true };

        } catch (error) {
            await trx.rollback();
            console.error("PO Sync Transaction Failed:", error);

            if (error?._code) {
                throw error;
            }

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "PO Sync transaction failed.",
                property: "",
                code: "PO_SYNC_FAILED"
            });
        }
    }

    async function getPurchaseSyncRepo({ params }) {
        const knex = this;
        const { flag, outlet_id } = params;
        const response = await knex.transaction(async trx => {

            const master = await trx(OUTLET_PURCHASE_MASTER.NAME)
                .select(
                    `${OUTLET_PURCHASE_MASTER.NAME}.*`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} AS supplier_customer_code`,
                    trx.raw(
                        `TO_CHAR(${OUTLET_PURCHASE_MASTER.NAME}.docdate, 'YYYY-MM-DD') AS grn_date`
                    ),
                    trx.raw(
                        `TO_CHAR(${OUTLET_PURCHASE_MASTER.NAME}.invoice_date, 'YYYY-MM-DD') AS invoice_date`
                    ),
                    trx.raw(
                        `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO} AS grn_no`
                    )
                )
                .leftJoin(
                    SUPPLIER_OUTLET_MAPPING.NAME,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
                )
                .andWhere(
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE_SYNC}`,
                    flag
                )
                .andWhere(
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
                    outlet_id
                )
                .andWhere(
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.IS_ACTIVE}`,
                    true
                )
                .andWhere(
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE}`,
                    true
                )
                .andWhere(
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
                    outlet_id
                )
                .orderBy(
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`,
                    "asc"
                )
                .first();

            if (!master) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "GRN data not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const grn_id = Number(master.id);
            const grn_no = String(master.docno);

            const details = await trx(OUTLET_PURCHASE_DETAILS.NAME)
                .select(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.*`,
                    `${ITEM.NAME}.pro_name AS prod_name`,
                    `${ITEM.NAME}.type_id AS product_type`,
                    `${TYPEDESIGN.NAME}.type_name AS brand_company_name`,
                    `${OUTLETS.NAME}.fullname AS outlet_name`,
                    trx.raw(
                        `TO_CHAR(${OUTLET_PURCHASE_DETAILS.NAME}.created_at, 'YYYY-MM-DD') AS created_at`
                    ),
                    trx.raw(
                        `TO_CHAR(${OUTLET_PURCHASE_DETAILS.NAME}.updated_at, 'YYYY-MM-DD') AS updated_at`
                    ),
                    trx.raw(
                        `TO_CHAR(${OUTLET_PURCHASE_DETAILS.NAME}.docdate, 'YYYY-MM-DD') AS grn_date`
                    )
                )
                .leftJoin(
                    ITEM.NAME,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID}`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                )
                .leftJoin(
                    TYPEDESIGN.NAME,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.TYPE_DESIGN_ID}`,
                    `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                )
                .leftJoin(
                    OUTLETS.NAME,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID}`,
                    `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
                )
                .where(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID}`,
                    grn_id
                )
                .andWhere(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_SYNC}`,
                    flag
                )
                .andWhere(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.QTY}`,
                    ">",
                    0
                )
                .orderBy(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.ID}`,
                    "asc"
                );

            // console.log(details, '=========deails===========')

            const grnBatchDetails = await knex(OUTLET_PURCHASE_BATCH_DETAILS.NAME)
                .select(
                    `${OUTLET_PURCHASE_BATCH_DETAILS.NAME}.*`,
                    knex.raw(
                        `SUBSTRING(${OUTLET_PURCHASE_BATCH_DETAILS.NAME}.expiry_date FROM 1 FOR 10) AS expiry_date`
                    )
                )
                .where(
                    `${OUTLET_PURCHASE_BATCH_DETAILS.NAME}.${OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID}`,
                    grn_id
                );


            const batchMap = {};

            for (const batch of grnBatchDetails) {
                const productId = batch.product_id;

                if (!batchMap[productId]) {
                    batchMap[productId] = [];
                }

                batchMap[productId].push(batch);
            }

            /* ---------------------------------
               5. MERGE BATCHES INTO DETAILS
            ----------------------------------*/
            const mergedGrnDetails = details.map(detail => ({
                ...detail,
                outlet_grn_batch_details: batchMap[detail.prod_id] || []
            }));

            return {
                grn_no,
                master,
                details: mergedGrnDetails,
            };
        });

        return response;
    }

    async function putOutletGrnSyncRepo({ params, body, userDetails }) {
        const knex = this;
        const { grn_no, outlet_id } = params;
        const { flag, outlet_grn_no } = body;

        const trx = await knex.transaction();

        try {
            const existingGRNMaster = await trx(OUTLET_PURCHASE_MASTER.NAME)
                .select(
                    OUTLET_PURCHASE_MASTER.COLUMNS.ID,
                    OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO,
                    OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID
                )
                .where({
                    [OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO]: String(grn_no),
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE]: true,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE_SYNC]: 0
                })
                .first();

            if (!existingGRNMaster?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No Records Found in GRN Master (Check GRN Details)",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const grnMasterId = existingGRNMaster.id;

            const grnDetails = await trx(OUTLET_PURCHASE_DETAILS.NAME)
                .select(OUTLET_PURCHASE_DETAILS.COLUMNS.ID)
                .where({
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.DOCNO]: grn_no,
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_SYNC]: 0
                });

            if (!grnDetails || grnDetails.length === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No GRN Details Found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const currentTime = new Date();

            // 3️⃣ Update po_details first (bulk update)
            const updateDetails = await trx(OUTLET_PURCHASE_DETAILS.NAME)
                .where({
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.DOCNO]: grn_no,
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_SYNC]: 0
                })
                .update({
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_SYNC]: flag,
                    [OUTLET_PURCHASE_DETAILS.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateDetails === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update GRN Details",
                    property: "",
                    code: "DETAILS_UPDATE_FAILED"
                });
            }

            const updateMaster = await trx(OUTLET_PURCHASE_MASTER.NAME)
                .where({
                    [OUTLET_PURCHASE_MASTER.COLUMNS.ID]: grnMasterId,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO]: grn_no,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE]: true,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE_SYNC]: 0
                })
                .update({
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE_SYNC]: flag,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_GRN_NO]: outlet_grn_no,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateMaster === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update GRN Master",
                    property: "",
                    code: "MASTER_UPDATE_FAILED"
                });
            }

            const existingReturnMaster = await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                .select(OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID)
                .where({
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_NO]: String(grn_no),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_SYNC]: 0
                })
                .first();

            if (existingReturnMaster?.id) {
                await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                    .where({
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID]: existingReturnMaster.id
                    })
                    .update({
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_PURCHASE_NO]: outlet_grn_no,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.UPDATED_AT]: currentTime
                    });
            }

            await trx.commit();

            return { success: true };

        } catch (error) {
            await trx.rollback();
            console.error("GRN Sync Transaction Failed:", error);

            if (error?._code) {
                throw error;
            }

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "GRN Sync transaction failed.",
                property: "",
                code: "GRN_SYNC_FAILED"
            });
        }
    }

    async function getPurchaseReturnSyncRepo({ params }) {

        const knex = this;
        const { flag, outlet_id } = params;
        const response = await knex.transaction(async trx => {

            const master = await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                .select(
                    `${OUTLET_PURCHASE_RETURN_MASTER.NAME}.*`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} AS supplier_customer_code`,
                    knex.raw(`TO_CHAR(${OUTLET_PURCHASE_RETURN_MASTER.NAME}.po_date, 'YYYY-MM-DD') AS po_date`)
                )
                .leftJoin(
                    `${SUPPLIER_OUTLET_MAPPING.NAME}`,
                    `${OUTLET_PURCHASE_RETURN_MASTER.NAME}.${OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID}`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
                )
                .where(`${OUTLET_PURCHASE_RETURN_MASTER.NAME}.${OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_SYNC}`, flag)
                .where(`${OUTLET_PURCHASE_RETURN_MASTER.NAME}.${OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
                .orderBy(`${OUTLET_PURCHASE_RETURN_MASTER.NAME}.${OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID}`, "desc")
                .first();

            if (!master) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Purchase Return data not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const docNo = master.doc_no;

            const details = await knex(OUTLET_PURCHASE_RETURN_DETAILS.NAME)
                .select(
                    `${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.*`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as prod_name`,
                    knex.raw(`TO_CHAR(${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.created_at, 'YYYY-MM-DD') AS created_at`),
                    knex.raw(`TO_CHAR(${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.updated_at, 'YYYY-MM-DD') AS updated_at`),
                    knex.raw(`TO_CHAR(${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.po_date, 'YYYY-MM-DD') AS po_date`)
                )
                .from(OUTLET_PURCHASE_RETURN_DETAILS.NAME)
                .leftJoin(
                    ITEM.NAME,
                    `${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.${OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PRODUCT_ID}`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                )
                .where(`${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.${OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_NO}`, docNo)
                .where(`${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.${OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.${OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_SYNC}`, flag)
                .where(`${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.${OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY}`, '>', 0)
                .orderBy(`${OUTLET_PURCHASE_RETURN_DETAILS.NAME}.id`, 'asc');

            return {
                docNo: docNo,
                master,
                details
            };
        });

        return response;
    }

    async function putOutletPurchaseReturnSyncRepo({ params, body, userDetails }) {
        const knex = this;
        const { doc_no, outlet_id, outlet_purchase_no } = params;
        const { flag, outlet_purchase_return_no } = body;

        const trx = await knex.transaction();

        try {
            const existingReturnMaster = await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                .select(
                    OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID,
                    OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_NO,
                    OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID
                )
                .where({
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_NO]: String(doc_no),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_PURCHASE_NO]: outlet_purchase_no,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_SYNC]: 0
                })
                .first();

            if (!existingReturnMaster?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No Records Found in Purchase return Master",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const returnMasterId = existingReturnMaster.id;

            const returnDetails = await trx(OUTLET_PURCHASE_RETURN_DETAILS.NAME)
                .select(OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.ID)
                .where({
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_NO]: doc_no,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_SYNC]: 0
                });

            if (!returnDetails || returnDetails.length === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No Return Details Found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const currentTime = new Date();

            const updateDetails = await trx(OUTLET_PURCHASE_RETURN_DETAILS.NAME)
                .where({
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_NO]: doc_no,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_SYNC]: 0
                })
                .update({
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_SYNC]: flag,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateDetails === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update Return Details",
                    property: "",
                    code: "DETAILS_UPDATE_FAILED"
                });
            }
            const updateMaster = await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                .where({
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID]: returnMasterId,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_PURCHASE_NO]: outlet_purchase_no,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_NO]: doc_no,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_SYNC]: 0
                })
                .update({
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_SYNC]: flag,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_PURCHASE_RETURN_NO]: outlet_purchase_return_no,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateMaster === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update Purchase Master",
                    property: "",
                    code: "MASTER_UPDATE_FAILED"
                });
            }

            await trx.commit();

            return { success: true };

        } catch (error) {
            await trx.rollback();
            console.error("GRN Sync Transaction Failed:", error);

            if (error?._code) {
                throw error;
            }

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Sync transaction failed.",
                property: "",
                code: "Return_SYNC_FAILED"
            });
        }
    }

    async function getOutletDebitNoteSyncRepo({ params, body, logTrace }) {
        const knex = this;
        const { flag, outlet_id } = params;
        const response = await knex.transaction(async trx => {

            const master = await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                .select(
                    `${OUTLET_DEBIT_NOTE_MASTER.NAME}.*`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE} AS supplier_customer_code`,
                    knex.raw(`TO_CHAR(${OUTLET_DEBIT_NOTE_MASTER.NAME}.${OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_DATE}, 'YYYY-MM-DD') AS doc_date`),
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_GRN_NO} AS outlet_grn_no`,
                    knex.raw(`TO_CHAR(${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOWN_TIME}, 'YYYY-MM-DD') AS grn_sync_date`)
                )
                .leftJoin(
                    `${SUPPLIER_OUTLET_MAPPING.NAME}`,
                    `${OUTLET_DEBIT_NOTE_MASTER.NAME}.${OUTLET_DEBIT_NOTE_MASTER.COLUMNS.SUPPLIER_ID}`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
                )
                .leftJoin(
                    `${OUTLET_PURCHASE_MASTER.NAME}`,
                    `${OUTLET_DEBIT_NOTE_MASTER.NAME}.${OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_DOC_NO}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`
                )
                .where(`${OUTLET_DEBIT_NOTE_MASTER.NAME}.${OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DEBIT_NOTE_SYNC}`, flag)
                .where(`${OUTLET_DEBIT_NOTE_MASTER.NAME}.${OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
                .orderBy(`${OUTLET_DEBIT_NOTE_MASTER.NAME}.${OUTLET_DEBIT_NOTE_MASTER.COLUMNS.ID}`, "asc")
                .first();

            if (!master) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Debit Note data not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }


            const docNo = master.id;

            const details = await knex(OUTLET_DEBIT_NOTE_DETAILS.NAME)
                .select(
                    `${OUTLET_DEBIT_NOTE_DETAILS.NAME}.*`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as prod_name`,
                    knex.raw(`TO_CHAR(${OUTLET_DEBIT_NOTE_DETAILS.NAME}.created_at, 'YYYY-MM-DD') AS created_at`),
                    knex.raw(`TO_CHAR(${OUTLET_DEBIT_NOTE_DETAILS.NAME}.updated_at, 'YYYY-MM-DD') AS updated_at`)
                )
                .from(OUTLET_DEBIT_NOTE_DETAILS.NAME)
                .leftJoin(
                    ITEM.NAME,
                    `${OUTLET_DEBIT_NOTE_DETAILS.NAME}.${OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.PRODUCT_ID}`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                )
                .where(`${OUTLET_DEBIT_NOTE_DETAILS.NAME}.${OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_DEBIT_NOTE_MST_ID}`, docNo)
                .where(`${OUTLET_DEBIT_NOTE_DETAILS.NAME}.${OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_ID}`, outlet_id)
                .where(`${OUTLET_DEBIT_NOTE_DETAILS.NAME}.${OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.DEBIT_NOTE_SYNC}`, flag)
                .where(`${OUTLET_DEBIT_NOTE_DETAILS.NAME}.${OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.QTY}`, '>', 0)
                .orderBy(`${OUTLET_DEBIT_NOTE_DETAILS.NAME}.id`, 'asc');

            return {
                docNo: docNo,
                master,
                details
            };
        });

        return response;
    }

    async function putOutletDebitNoteSyncRepo({ params, body, userDetails }) {
        const knex = this;
        const { doc_no, outlet_id } = params;
        const { flag, outlet_debit_note_no } = body;

        const trx = await knex.transaction();

        try {
            const existingDebitNoteMaster = await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                .select(
                    OUTLET_DEBIT_NOTE_MASTER.COLUMNS.ID,
                    OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_NO,
                    OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_ID
                )
                .where({
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_NO]: String(doc_no),
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DEBIT_NOTE_SYNC]: 0
                })
                .first();

            if (!existingDebitNoteMaster?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No Records Found in Debit Note Master",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const debitNoteMasterId = existingDebitNoteMaster.id;

            const returnDetails = await trx(OUTLET_DEBIT_NOTE_DETAILS.NAME)
                .select(OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.ID)
                .where({
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_DEBIT_NOTE_MST_ID]: debitNoteMasterId,
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.DEBIT_NOTE_SYNC]: 0
                });

            if (!returnDetails || returnDetails.length === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "No Debit note Details Found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const currentTime = new Date();

            const updateDetails = await trx(OUTLET_DEBIT_NOTE_DETAILS.NAME)
                .where({
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_DEBIT_NOTE_MST_ID]: debitNoteMasterId,
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.DEBIT_NOTE_SYNC]: 0
                })
                .update({
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.DEBIT_NOTE_SYNC]: flag,
                    [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateDetails === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update debit note Details",
                    property: "",
                    code: "DETAILS_UPDATE_FAILED"
                });
            }
            const updateMaster = await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                .where({
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.ID]: debitNoteMasterId,
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_NO]: doc_no,
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DEBIT_NOTE_SYNC]: 0
                })
                .update({
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DEBIT_NOTE_SYNC]: flag,
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_DEBIT_NOTE_NO]: outlet_debit_note_no,
                    [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOWN_TIME]: currentTime
                });

            if (updateMaster === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Failed to update Debit Note Master",
                    property: "",
                    code: "MASTER_UPDATE_FAILED"
                });
            }

            await trx.commit();

            return { success: true };

        } catch (error) {
            await trx.rollback();
            console.error("Debit Note Sync Transaction Failed:", error);

            if (error?._code) {
                throw error;
            }

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Sync transaction failed.",
                property: "",
                code: "Debit_Note_Sync_Failed"
            });
        }
    }

    async function getWarehouseSalesSyncRepo({ body, params, logTrace }) {
        const knex = this;
        const { warehouse_id } = params
        const query = knex
            .select([
                `${SALES_FMCG_MASTER.NAME}.*`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_full_name`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`
            ])
            .from(`${SALES_FMCG_MASTER.NAME} as ${SALES_FMCG_MASTER.NAME}`)
            .leftJoin(
                `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.WH_ID}`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
            )
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.LOCATION_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
                `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
            )
            .where(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.WH_ID}`, warehouse_id)
            .andWhere(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.IS_SALES_SYNC}`, false)
            .limit(1)


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Sales",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const sales_fmcg_details = await Promise.all(
            response.map(async sales => {
                const sales_lines = await knex
                    .select([
                        `${SALES_FMCG_DETAILS.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
                    ])
                    .from(`${SALES_FMCG_DETAILS.NAME} as ${SALES_FMCG_DETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PRODID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${HEADS.NAME} as ${HEADS.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
                    )
                    .where(
                        `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID}`,
                        sales.id
                    );

                return { ...sales, sales_lines };

            })
        );

        return sales_fmcg_details;
    }

    async function updateWarehouseSalesSyncRepo({ body, params, logTrace, userDetails }) {
        const knex = this;
        const { op_doc_no } = params;

        const query = knex(SALES_FMCG_MASTER.NAME)
            .where(SALES_FMCG_MASTER.COLUMNS.DOCNO, op_doc_no)
            .first()

        const exists_response = await query;

        if (!exists_response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "warehouse sales sync not found to update",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query_update = await knex(`${SALES_FMCG_MASTER.NAME}`)
            .where(SALES_FMCG_MASTER.COLUMNS.DOCNO, op_doc_no)
            .update({
                [SALES_FMCG_MASTER.COLUMNS.IS_SALES_SYNC]: true,
                [SALES_FMCG_MASTER.COLUMNS.OP_DOC_NO]: op_doc_no,
                [SALES_FMCG_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                [SALES_FMCG_MASTER.COLUMNS.UPDATED_BY]: userDetails?.id || 1
            });

        const response = await query_update;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while updating warehouse sales sync update",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }

        return { success: true };
    }

    async function getWarehouseSalesReturnSyncRepo({ body, params, logTrace }) {
        const knex = this;
        const { warehouse_id } = params
        const query = knex
            .select([
                `${SALES_RETURN_MASTER.NAME}.*`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_full_name`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`
            ])
            .from(`${SALES_RETURN_MASTER.NAME} as ${SALES_RETURN_MASTER.NAME}`)
            .leftJoin(
                `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.WAREHOUSE_ID}`,
                `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
            )
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.CUSTOMER_ID}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.LOCATION_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
                `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
            )
            .where(`${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.WAREHOUSE_ID}`, warehouse_id)
            .andWhere(`${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.IS_SALES_RETURN_SYNC}`, false)
            .limit(1)


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Sales",
            logTrace
        });
        const response = await query;
        console.log(response, "response");

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const sales_fmcg_details = await Promise.all(
            response.map(async sales => {
                const sales_lines = await knex
                    .select([
                        `${SALES_RETURN_DETAILS.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
                    ])
                    .from(`${SALES_RETURN_DETAILS.NAME} as ${SALES_RETURN_DETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${HEADS.NAME} as ${HEADS.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
                        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
                        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
                        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
                    )
                    .where(
                        `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID}`,
                        sales.id
                    );

                return { ...sales, sales_lines };

            })
        );

        return sales_fmcg_details;
    }

    async function updateWarehouseSalesReturnSyncRepo({ body, params, logTrace, userDetails }) {
        const knex = this;
        const { opr_doc_no } = params;

        const query = knex(SALES_RETURN_MASTER.NAME)
            .where(SALES_RETURN_MASTER.COLUMNS.DOCNO, opr_doc_no)
            .first()

        const exists_response = await query;

        if (!exists_response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "warehouse sales return sync not found to update",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query_update = await knex(`${SALES_RETURN_MASTER.NAME}`)
            .where(SALES_RETURN_MASTER.COLUMNS.DOCNO, opr_doc_no)
            .update({
                [SALES_RETURN_MASTER.COLUMNS.IS_SALES_RETURN_SYNC]: true,
                [SALES_RETURN_MASTER.COLUMNS.OPR_DOC_NO]: opr_doc_no,
                [SALES_RETURN_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                [SALES_RETURN_MASTER.COLUMNS.UPDATED_BY]: userDetails?.id || 1
            });

        const response = await query_update;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while updating warehouse sales return sync update",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }

        return { success: true };
    }

    return {
        getBrandSyncDetails,
        getUnitsSync,
        getBrandCompanySyncDetails,
        getMerchantCategorySyncDetails,
        getCategorySyncDetails,
        getItemDeleteDetails,
        getCategoryEditSyncDetails,
        getBrandEditSyncDetails,
        getMerchantCategoryEditDetails,
        getBrandCompanyEditSyncDetails,
        getItemBarcodeSyncDetails,
        getItemSettingSyncDetails,
        getProductMasterSyncDetails,
        getProductMasterEditSyncDetails,
        putProductSyncDetails,
        getSuplierOutletMappingDetailsRepo,
        putSuplierOutletMappingDetailsRepo,
        getSuplierInsertUpdateDetailsRepo,
        putSyncSupplierFlagUpdateRepo,
        getSyncOutletPoDetailsRepo,
        getReDetailsRepo,
        updateReDetailsRepo,
        getpoSyncPaginate,
        putOutletPOSyncRepo,
        getPurchaseSyncRepo,
        putOutletGrnSyncRepo,
        getPurchaseReturnSyncRepo,
        putOutletPurchaseReturnSyncRepo,
        getOutletDebitNoteSyncRepo,
        putOutletDebitNoteSyncRepo,
        getWarehouseSalesSyncRepo,
        updateWarehouseSalesSyncRepo,
        getWarehouseSalesReturnSyncRepo,
        updateWarehouseSalesReturnSyncRepo
    };
}

module.exports = categoryRepo;
