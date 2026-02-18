const axios = require('axios');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { UNITS, ITEM, HEADS, TYPEDESIGN, MAIN_CATEGORY, SUB_CATEGORY, OUTLET_PRODUCT_MAPPING, VENDORS_MAPPING, BARCODE_LIST } = require("../commons/constants");
const { OUTLETS } = require('../../../accounts/outlets/commons/constants');
const { SUPPLIER } = require('../../../catalog/commons');


function itemRepo(fastify) {
    async function postItemSyncDetails({ company_id, id }) {
        const base_url = process.env.BASE_URL;
        const token = process.env.TOKEN;
        const knex = this;

        // Fetch items from API before starting transaction
        try {
            await axios.put(`${base_url}/sync/items/status/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const response = await axios.get(`${base_url}/sync/items/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data } = response;
            const trx = await knex.transaction();

            try {
                // Fetch existing items from DB
                const existingItems = await trx(ITEM.NAME)
                    .select(ITEM.COLUMNS.ID, ITEM.COLUMNS.PRODUCT_CODE);

                const existingMap = new Map(existingItems.map(c => [c.id, c]));

                const itemData = [];
                const outletMappings = [];
                const vendorMappings = [];
                const barcodeMappings = [];

                data.forEach(c => {
                    const itemRecord = {
                        [ITEM.COLUMNS.ID]: c.id,
                        [ITEM.COLUMNS.PRODUCT_CODE]: c.pro_code,
                        [ITEM.COLUMNS.PRODUCT_NAME]: c.pro_name,
                        [ITEM.COLUMNS.SHORT_NAME]: c.short_name || null,
                        [ITEM.COLUMNS.PRO_DESCRIPTION]: c.pro_description || null,
                        [ITEM.COLUMNS.MANUFACTURING_DATE]: c.manufacturing_date || null,
                        [ITEM.COLUMNS.EXPIRY_DATE]: c.expiry_date || null,
                        [ITEM.COLUMNS.TYPE]: c.type,
                        [ITEM.COLUMNS.SUB_CATEGORY]: c.sub_cat,
                        [ITEM.COLUMNS.UOM]: c.uom,
                        [ITEM.COLUMNS.BARCODE]: c.barcode || null,
                        [ITEM.COLUMNS.PARCHASE_RATE]: c.pur_rate,
                        [ITEM.COLUMNS.SALE_RATE]: c.sale_rate,
                        [ITEM.COLUMNS.WHOLESALE_RATE]: c.wholesale_rate,
                        [ITEM.COLUMNS.MRP]: c.mrp,
                        [ITEM.COLUMNS.GST]: c.gst,
                        [ITEM.COLUMNS.CESS]: c.cess,
                        [ITEM.COLUMNS.HSN]: c.hsn,
                        [ITEM.COLUMNS.OP_STK]: c.op_stk,
                        [ITEM.COLUMNS.BALANCE]: c.balance,
                        [ITEM.COLUMNS.MIN_STOCK]: c.min_stock,
                        [ITEM.COLUMNS.ALLOW_NEG_STK]: c.allow_neg_stock,
                        [ITEM.COLUMNS.WSCALE]: c.wscale,
                        [ITEM.COLUMNS.HEADID]: c.head_id,
                        [ITEM.COLUMNS.CATID]: c.cat_id,
                        [ITEM.COLUMNS.COMPANY_ID]: company_id,
                        [ITEM.COLUMNS.IS_ACTIVE]: c.is_active,
                        [ITEM.COLUMNS.CREATED_BY]: c.created_by,
                        [ITEM.COLUMNS.UPDATED_BY]: c.updated_by,
                        [ITEM.COLUMNS.PRODUCT_TYPE]: c.product_type,
                        [ITEM.COLUMNS.MAIN_UOM_ID]: c.main_uom_id,
                        [ITEM.COLUMNS.CONVERTION_FACTOR]: c.convertion_factor,
                        [ITEM.COLUMNS.MAIN_PRODUCT_ID]: c.main_product_id || null,
                        [ITEM.COLUMNS.MAIN_PRODUCT_QTY]: c.main_product_qty
                    };

                    itemData.push(itemRecord);

                    // Outlet product mappings
                    if (c.outlets && Array.isArray(c.outlets)) {
                        c.outlets.forEach(outlet => {
                            outletMappings.push({
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: outlet.id,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: c.pro_code,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: c.id,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: outlet.opng_stock,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: outlet.balnc_stock,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: outlet.min_stock,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: outlet.allow_neg_stk,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: outlet.wscale,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK]: outlet.min_warn_stock,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: c.created_by,
                                [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: c.is_active
                            });
                        });
                    }

                    // Vendor mappings
                    if (c.vendors && Array.isArray(c.vendors)) {
                        c.vendors.forEach(vendor => {
                            vendorMappings.push({
                                [VENDORS_MAPPING.COLUMNS.ID]: vendor.id,
                                [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: vendor.vendors_id,
                                [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: c.pro_code,
                                [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: c.id,
                                [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                                [VENDORS_MAPPING.COLUMNS.CREATED_BY]: c.created_by,
                                [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: c.is_active
                            });
                        });
                    }

                    // Barcode mappings (ensure outlet exists)
                    if (c.barcode_list && Array.isArray(c.barcode_list)) {
                        c.barcode_list.forEach(barcode => {
                            barcodeMappings.push({
                                [BARCODE_LIST.COLUMNS.ID]: barcode.id,
                                [BARCODE_LIST.COLUMNS.PROD_ID]: c.id,
                                [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                                [BARCODE_LIST.COLUMNS.OUTLET_ID]: barcode.outlet_id,
                                [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: barcode.product_code,
                                [BARCODE_LIST.COLUMNS.BARCODE]: barcode.barcode,
                                [BARCODE_LIST.COLUMNS.CREATED_BY]: barcode.created_by
                            });
                        });
                    }
                });

                // Perform upsert (insert or update)
                if (itemData.length) {
                    await trx(ITEM.NAME)
                        .insert(itemData)
                        .onConflict(ITEM.COLUMNS.ID)
                        .merge();
                }

                // Perform bulk inserts
                if (outletMappings.length) {
                    await trx(OUTLET_PRODUCT_MAPPING.NAME)
                        .insert(outletMappings)
                        .onConflict(OUTLET_PRODUCT_MAPPING.COLUMNS.ID) // Primary key conflict handling
                        .merge();
                }
                if (vendorMappings.length) {
                    await trx(VENDORS_MAPPING.NAME)
                        .insert(vendorMappings)
                        .onConflict(VENDORS_MAPPING.COLUMNS.ID) // Primary key conflict handling
                        .merge();
                }
                if (barcodeMappings.length) {
                    await trx(BARCODE_LIST.NAME)
                        .insert(barcodeMappings)
                        .onConflict(BARCODE_LIST.COLUMNS.ID) // Primary key conflict handling
                        .merge();
                }
                // Commit transaction
                await trx.commit();

                // Update sync status after sync
                await axios.put(`${base_url}/sync/items/false/change`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Items sync successful at", new Date().toLocaleTimeString());
                return { success: true };

            } catch (error) {
                await trx.rollback();
                console.error("Error syncing Items details:", error);

                throw CustomError.create({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error syncing Items details",
                    property: '',
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        } catch (error) {
            console.error("API Request Failed:", error);
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch sync details",
                property: '',
                code: "API_FETCH_ERROR"
            });
        }
    }

    async function getItemSync({ logTrace }) {
        const knex = this;
        const query = knex
            .select([
                `${ITEM.NAME}.*`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
                `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
                `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`
            ])
            .from(`${ITEM.NAME} as ${ITEM.NAME}`)
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
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.IS_INSERTED}`, true)
            .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, "ASC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Item",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Item not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        // return response;
        const itemWithOutlets = await Promise.all(
            response.map(async item => {

                const outlets = await knex
                    .select([`${OUTLET_PRODUCT_MAPPING.NAME}.*`])
                    .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
                    .leftJoin(
                        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
                        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
                    )
                    .where(
                        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
                        true
                    )
                    .where(
                        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`,
                        true
                    )
                    .where(
                        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
                        item.id
                    );
                const vendors = await knex
                    .select([`${VENDORS_MAPPING.NAME}.*`])
                    .from(`${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`)
                    .where(
                        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`,
                        true
                    )
                    .where(
                        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
                        item.id
                    );
                const barcode_list = await knex
                    .select([`${BARCODE_LIST.NAME}.*`])
                    .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
                    .where(
                        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_ACTIVE}`,
                        true
                    )
                    .where(
                        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
                        item.id
                    );


                return { ...item, outlets, vendors, barcode_list };
            })
        );


        return itemWithOutlets;
    }

    async function putItemStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(ITEM.NAME)
            .update({
                [ITEM.COLUMNS.IS_INSERTED]: true,
                [ITEM.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Item Status",
            logTrace
        });

        await query;
        return { success: true };
    }

    async function putItemFalseStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(ITEM.NAME)
            .update({
                [ITEM.COLUMNS.IS_INSERTED]: false,
                [ITEM.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Type Item",
            logTrace
        });

        await query;
        return { success: true };
    }


    return {
        postItemSyncDetails,
        getItemSync,
        putItemStatusChange,
        putItemFalseStatusChange
    };
}

module.exports = itemRepo;
