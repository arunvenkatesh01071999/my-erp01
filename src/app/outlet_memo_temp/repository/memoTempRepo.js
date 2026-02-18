const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { OUTLET_PURCHASE_MEMO_MASTER_TEMP, OUTLET_PURCHASE_MEMO_DETAILS_TEMP, OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP } = require("../commons/constants")
const { SUPPLIER, ITEM } = require("../../catalog/item/commons/constants");
const { UNITS } = require("../../catalog/units/commons/constants");
const { OUTLETS } = require("../../accounts/outlets/commons/constants");
const { USERS } = require("../../accounts/admin/commons/constants");
const { OUTLET_PO_MASTER, OUTLET_PO_DETAILS } = require("../../outlet_po/Outlet_po_auto/commons/constants");
const { REGION } = require("../../catalog/warehouse/commons/constants");


function OutletRepo(fastify) {

    async function postOutletPurchaseMemoTempRepo({ params, body, logTrace, userDetails }) {
        const knex = this;
        const trx = await knex.transaction();

        try {
            const companyId = body.company_id || 1;
            const outletId = body.outlet_id;

            /* ---------- GET NEXT MEMO NO (ONLY FOR NEW RECORDS) ---------- */
            const lastMemo = await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                .select(OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_NO)
                .where(OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID, outletId)
                .orderBy(OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID, "desc")
                .first();

            const nextMemoNo = Number(lastMemo?.memo_no || 0) + 1;

            /* ---------- MASTER INSERT PAYLOAD ---------- */
            const masterInsertPayload = {
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_NO]: nextMemoNo,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_DATE]: new Date(),
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO]: body.pono,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE]: body.podate,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID]: outletId,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.WAREHOUSE_ID]: body.warehouse_id || 1,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.COMPANY_ID]: companyId,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_NO]: body.party_invoice_no,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_DATE]: body.party_invoice_date,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_AMOUNT]: body.invoice_amount || 0,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.IMAGE_URL]: body.image_url || null,
                [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.CREATED_BY]: userDetails?.id
            };

            /* ---------- MASTER UPSERT (DO NOT UPDATE memo_no) ---------- */
            const [masterRow] = await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                .insert(masterInsertPayload)
                .onConflict([
                    OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID,
                    OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID,
                    OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO
                ])
                .merge({
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_DATE]: new Date(),
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE]: body.podate,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.WAREHOUSE_ID]: body.warehouse_id || 1,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_NO]: body.party_invoice_no,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_DATE]: body.party_invoice_date,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_AMOUNT]: body.invoice_amount || 0,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.IMAGE_URL]: body.image_url || null,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.UPDATED_BY]: userDetails?.id,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.UPDATED_AT]: new Date()
                })
                .returning(["id", "memo_no"]);

            const memoMasterId = masterRow.id;
            const memoNo = masterRow.memo_no;

            /* ---------- DETAILS UPSERT ---------- */
            if (Array.isArray(body.purchase_memo_details) && body.purchase_memo_details.length) {

                const invalidItem = body.purchase_memo_details.find(d =>
                    Number(d.received_qty) === 0 || Number(d.memo_mrp) === 0
                );

                if (invalidItem) {
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: `received_qty and memo_mrp must be greater than zero`,
                        code: "NOT_FOUND"
                    });
                }

                const detailRows = body.purchase_memo_details.map(d => ({
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID]: memoMasterId,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_NO]: memoNo,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_DATE]: new Date(),
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_NO]: body.pono,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.COMPANY_ID]: companyId,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.WAREHOUSE_ID]: body.warehouse_id || 1,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID]: d.product_id,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_CODE]: d.product_code,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_QTY]: d.po_order_qty || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY]: d.received_qty || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY]: d.free_qty || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY]: d.return_qty || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_TOTAL_QTY]: d.total_qty || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_MRP]: d.memo_mrp || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_MRP]: d.po_mrp || 0,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UOM_ID]: d.uom_id || 1,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.CREATED_BY]: userDetails?.id,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UPDATED_BY]: userDetails?.id,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UPDATED_AT]: new Date()
                }));

                await trx(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
                    .insert(detailRows)
                    .onConflict([
                        OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                        OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID
                    ])
                    .merge();
            }

            /* ---------- BATCH UPSERT ---------- */
            if (Array.isArray(body.purchase_memo_details)) {
                const batchRows = body.purchase_memo_details.flatMap(d =>
                    (d.memo_batch_details || []).map(b => ({
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID]: memoMasterId,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID]: d.product_id,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_CODE]: d.product_code,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO]: b.batch_no,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_QTY]: b.qty || 0,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY]: b.free_qty || 0,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY]: b.return_qty || 0,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_MRP]: b.mrp || 0,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_ID]: b.expiry_type || 0,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_VALUE]: b.expiry_value || 0,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MANUFACTURE_DATE]: b.manufacture_date,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_DATE]: b.expiry_date,
                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.COMPANY_ID]: companyId
                    }))
                );

                if (batchRows.length) {
                    await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
                        .insert(batchRows)
                        .onConflict([
                            OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                            OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID,
                            OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO
                        ])
                        .merge();
                }
            }
            if (Array.isArray(body.purchase_memo_details) && body.purchase_memo_details.length) {
                const productIds = body.purchase_memo_details.map(d => d.product_id);

                await trx(OUTLET_PO_DETAILS.NAME)
                    .where({
                        [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: body.pono,
                        [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outletId,
                        [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id
                    })
                    .whereIn(OUTLET_PO_DETAILS.COLUMNS.PROD_ID, productIds)
                    .update({
                        [OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_TEMP]: true,
                        [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                        [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails?.id
                    });
            }

            await trx(OUTLET_PO_MASTER.NAME)
                .where({
                    [OUTLET_PO_MASTER.COLUMNS.PO_NO]: body.pono,
                    [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id
                })
                .update({
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED]: true,
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_AT]: new Date(),
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_BY]: userDetails?.id,
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNEE_NAME]: userDetails.user_name
                });

            await trx.commit();

            return {
                success: true,
                message: "Purchase memo temp saved successfully",
                docno: memoNo,
                memoMasterTempId: memoMasterId
            };

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }


    async function getOutletPurchaseMemoTempRepo({ params }) {
        const knex = this;
        const { pono, outlet_id, supplier_id } = params;

        const master = await knex(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID} as id`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_NO} as memo_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO} as pono`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE} as podate`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_NO} as party_invoice_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_DATE} as party_invoice_date`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.IMAGE_URL}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`
            ])
            .leftJoin(
                OUTLETS.NAME,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                SUPPLIER.NAME,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID}`
            )
            .leftJoin(
                USERS.NAME,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.CREATED_BY}`
            )
            .where({
                [`${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO}`]: pono,
                [`${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`]: outlet_id,
                [`${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID}`]: supplier_id
            })
            .first();


        if (!master) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Purchase Memo Temp ${pono} data not found`,
                code: "NOT_FOUND"
            });
        }


        const itemRows = await knex(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID} as product_id`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_CODE} as product_code`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_QTY} as po_order_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY} as received_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY} as free_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY} as return_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_TOTAL_QTY} as total_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_MRP}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_MRP}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID} as uom_id`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`

            ])
            .leftJoin(
                ITEM.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID}`
            )
            .leftJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UOM_ID}`
            )
            .where(
                OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                master.id
            );

        if (!itemRows.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Purchase Memo Temp data${pono}`,
                code: "NOT_FOUND"
            });
        }


        const batchRows = await knex(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_QTY} as qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_MRP} as mrp`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY} as free_qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY} as return_qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_ID} as expiry_type`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_VALUE} as expiry_value`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_DATE}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MANUFACTURE_DATE}`
            ])
            .where(
                OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                master.id
            );

        const mergedItems = itemRows.map(item => ({
            ...item,
            memo_batch_details: batchRows.filter(b => b.product_id == item.product_id)
        }));

        return {
            memo_no: master.memo_no,
            memo_date: master.memo_date,
            pono: master.pono,
            podate: master.podate,
            party_invoice_no: master.party_invoice_no ?? "",
            party_invoice_date: master.party_invoice_date ?? null,
            invoice_amount: master.invoice_amount ?? 0,
            image_url: master.image_url ?? null,
            outlet_name: master.outlet_name ?? null,
            supplier_id: master?.supplier_id ?? 0,
            supplier_name: master.supplier_name ?? null,
            user_name: master.user_name ?? null,
            purchase_memo_details: mergedItems
        };
    }

    async function getAllOutletPurchaseMemoTempRepo({ params }) {
        const knex = this;
        const { outlet_id } = params;

        const masters = await knex(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_NO} as memo_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO} as pono`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE} as podate`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_NO} as party_invoice_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_DATE} as party_invoice_date`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.IMAGE_URL}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID} as supplier_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`
            ])
            .leftJoin(
                OUTLETS.NAME,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                SUPPLIER.NAME,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID}`
            )
            .leftJoin(
                USERS.NAME,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.CREATED_BY}`
            )
            .where(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`,
                outlet_id
            )
            .orderBy(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID}`,
                "desc"
            );

        if (!masters.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No Purchase Memo Temp found for outlet ${outlet_id}`,
                code: "NOT_FOUND"
            });
        }

        const masterIds = masters.map(m => m.id);

        const itemRows = await knex(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID} as product_id`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_CODE} as product_code`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_QTY} as po_order_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY} as received_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY} as free_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY} as return_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_TOTAL_QTY} as total_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_MRP}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_MRP}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID} as uom_id`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`
            ])
            .leftJoin(
                ITEM.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID}`
            )
            .leftJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UOM_ID}`
            )
            .whereIn(
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID}`,
                masterIds
            );


        const batchRows = await knex(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_QTY} as qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_MRP} as mrp`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY} as free_qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY} as return_qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_ID} as expiry_type`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_VALUE} as expiry_value`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_DATE}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MANUFACTURE_DATE}`
            ])
            .whereIn(
                OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                masterIds
            );

        const response = masters.map(master => {
            const items = itemRows
                .filter(i => i.op_memo_mst_temp_id === master.id)
                .map(item => ({
                    ...item,
                    memo_batch_details: batchRows.filter(
                        b =>
                            b.op_memo_mst_temp_id === master.id &&
                            b.product_id === item.product_id &&
                            Number(b.mrp) === Number(item.memo_mrp)
                    )
                }));

            return {
                memo_no: master.memo_no,
                memo_date: master.memo_date,
                pono: master.pono,
                podate: master.podate,
                party_invoice_no: master.invoice_no ?? "",
                party_invoice_date: master.invoice_date ?? null,
                invoice_amount: master.invoice_amount ?? 0,
                image_url: master.image_url ?? null,
                outlet_name: master.outlet_name ?? null,
                supplier_id: master.supplier_id ?? 0,
                supplier_name: master.supplier_name ?? null,
                user_name: master.user_name ?? null,
                purchase_memo_details: items
            };
        });

        return response;
    }

    async function deleteOutletPurchaseMemoTempRepo({ params }) {
        const knex = this;
        const { pono, outlet_id, supplier_id } = params;

        const trx = await knex.transaction();

        try {

            const master = await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                .where({
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO]: pono,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID]: supplier_id
                })
                .first();

            if (!master) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: `Purchase Memo Temp ${pono} data not found`,
                    code: "NOT_FOUND"
                });
            }

            await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
                .where(
                    OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                    master.id
                )
                .del();

            await trx(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
                .where(
                    OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                    master.id
                )
                .del();

            await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                .where(
                    OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID,
                    master.id
                )
                .del();

            await trx(OUTLET_PO_DETAILS.NAME)
                .where({
                    [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: pono,
                    [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id
                })
                .update({
                    [OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_TEMP]: false,
                    [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                    [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: 0
                });

            await trx(OUTLET_PO_MASTER.NAME)
                .where({
                    [OUTLET_PO_MASTER.COLUMNS.PO_NO]: pono,
                    [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id
                })
                .update({
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED]: false,
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_AT]: new Date(),
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_BY]: 0,
                    [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNEE_NAME]: ""
                });

            await trx.commit();

            return {
                success: true,
                message: `Purchase Memo Temp ${pono} deleted successfully`
            };

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async function getOutletPurchaseMemoProductTempRepo({ params }) {
        const knex = this;
        const { product_id, pono, outlet_id, supplier_id } = params;

        const itemRow = await knex(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
            .select(
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID} as product_id`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_CODE} as product_code`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_QTY} as po_order_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY} as received_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY} as free_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY} as return_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_TOTAL_QTY} as total_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_MRP}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_MRP}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID} as uom_id`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID} as op_memo_mst_temp_id`
            )
            .leftJoin(
                ITEM.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID}`
            )
            .leftJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UOM_ID}`
            )
            .where({
                [`${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID}`]: product_id,
                [`${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_NO}`]: pono,
                [`${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OUTLET_ID}`]: outlet_id,
                [`${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.SUPPLIER_ID}`]: supplier_id
            })
            .first();

        if (!itemRow) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Purchase Memo Temp ${pono}`,
                code: "NOT_FOUND"
            });
        }

        /** 2️⃣ Get batch details for this product */
        const memo_batch_details = await knex(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
            .select(
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_QTY} as qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_FREE_QTY} as free_qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY} as return_qty`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MEMO_MRP} as mrp`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.SELF_LIFE_EXPIRY_DAYS}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.MANUFACTURE_DATE} `,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_DATE}`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_ID} as expiry_type`,
                `${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.EXPIRY_VALUE}`
            )
            .where({
                [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID]:
                    itemRow.op_memo_mst_temp_id,
                [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID]: product_id
            });

        return {
            ...itemRow,
            memo_batch_details: memo_batch_details || []
        };
    }


    async function deleteOutletPurchaseMemoProductTempRepo({ params, userDetails }) {
        const knex = this;
        const { product_id, pono, outlet_id, supplier_id, batch_no } = params;

        const trx = await knex.transaction();

        try {

            const existingBatchRowOne = await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
                .where({
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID]: product_id,
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO]: batch_no
                })
                .first();

            switch (true) {
                case !existingBatchRowOne:
                    throw CustomError.create({
                        httpCode: StatusCodes.NOT_FOUND,
                        message: `Batch ${batch_no} not found for product ${product_id}`,
                        code: "NOT_FOUND"
                    });
            }

            const op_memo_mst_temp_id = existingBatchRowOne.op_memo_mst_temp_id;
            const batch_qty = existingBatchRowOne.memo_qty

            await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
                .where({
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID]: product_id,
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID]: op_memo_mst_temp_id,
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.BATCH_NO]: batch_no
                })
                .del();


            const existingBatchRowTwo = await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
                .where({
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.PRODUCT_ID]: product_id,
                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID]: op_memo_mst_temp_id
                })
                .first();

            switch (true) {
                case !existingBatchRowTwo:
                    await trx(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
                        .where({
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID]: product_id,
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_NO]: pono,
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.SUPPLIER_ID]: supplier_id
                        })
                        .del();
                    await trx(OUTLET_PO_DETAILS.NAME)
                        .where({
                            [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: pono,
                            [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: product_id,
                            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                            [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id
                        })
                        .update({
                            [OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_TEMP]: false,
                            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: 0
                        });
                    break;
                case !!existingBatchRowTwo:
                    await trx(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
                        .where({
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_NO]: pono,
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID]: product_id,
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.SUPPLIER_ID]: supplier_id
                        })
                        .update({
                            [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY]:
                                trx.raw(
                                    `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY} - ?`,
                                    [batch_qty]
                                )
                        });
                    break;

            }

            const existingProductRow = await trx(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
                .where({
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_NO]: pono,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
                    [OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.SUPPLIER_ID]: supplier_id
                })
                .first();

            switch (true) {
                case !existingProductRow:

                    await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                        .where({
                            [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO]: pono,
                            [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
                            [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID]: supplier_id
                        })
                        .del();

                    await trx(OUTLET_PO_DETAILS.NAME)
                        .where({
                            [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: pono,
                            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                            [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id
                        })
                        .update({
                            [OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_TEMP]: false,
                            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: 0
                        });

                    await trx(OUTLET_PO_MASTER.NAME)
                        .where({
                            [OUTLET_PO_MASTER.COLUMNS.PO_NO]: pono,
                            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                            [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id
                        })
                        .update({
                            [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED]: false,
                            [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_AT]: new Date(),
                            [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_BY]: 0,
                            [OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNEE_NAME]: ""
                        });
                    break;
            }

            await trx.commit();

            return {
                success: true,
                message: "Purchase memo temp product deleted successfully"
            };

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }


    async function getAllOutletPurchaseMemoSummaryTempRepo({ params, userDetails }) {
        const knex = this;
        const { outlet_id } = params;

        const user_id = userDetails?.id
        console.log(user_id, "user_id");


        const masters = await knex(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_NO} as memo_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO} as pono`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE} as podate`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_NO} as party_invoice_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_DATE} as party_invoice_date`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.IMAGE_URL}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`
            ])
            .leftJoin(
                OUTLETS.NAME,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                SUPPLIER.NAME,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID}`
            )
            .leftJoin(
                USERS.NAME,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.CREATED_BY}`
            )
            .where(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`,
                outlet_id
            )
            .andWhere(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.CREATED_BY}`,
                user_id
            )
            .orderBy(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID}`,
                "desc"
            );

        if (!masters.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No Purchase Memo Temp found for outlet ${outlet_id}`,
                code: "NOT_FOUND"
            });
        }

        const masterIds = masters.map(m => m.id);


        const itemCounts = await knex(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
            .select(
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID} as master_id`
            )
            .count("* as item_count")
            .whereIn(
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID}`,
                masterIds
            )
            .groupBy(
                `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID}`
            );

        // Convert to map for fast lookup
        const itemCountMap = {};
        itemCounts.forEach(row => {
            itemCountMap[row.master_id] = Number(row.item_count);
        });


        const response = masters.map(master => ({
            memo_no: master.memo_no,
            memo_date: master.memo_date,
            pono: master.pono,
            podate: master.podate,
            party_invoice_no: master.party_invoice_no ?? "",
            party_invoice_date: master.party_invoice_date ?? null,
            invoice_amount: master.invoice_amount ?? 0,
            image_url: master.image_url ?? null,
            outlet_name: master.outlet_name ?? null,
            supplier_id: master.supplier_id ?? 0,

            supplier_name: master.supplier_name ?? null,
            user_name: master.user_name ?? null,
            itemCount: itemCountMap[master.id] || 0
        }));

        return response;
    }

    async function getOutletPurchaseMemoTempReportRepo({ body, logTrace }) {
        const knex = this;
        const {
            from_date,
            to_date,
            company_id,
            region_id,
            outlet_id,
            page_size,
            current_page
        } = body;


        const query = knex
            .select([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${USERS.NAME}.${USERS.COLUMNS.ID} as user_id`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME} as user_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${REGION.NAME}.${REGION.COLUMNS.ID} as region_id`,
                `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_NO}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.MEMO_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_NO}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.INVOICE_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.IMAGE_URL}`
            ])
            .from(`${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME} as ${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}`)
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${REGION.NAME} as ${REGION.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
                `${REGION.NAME}.${REGION.COLUMNS.ID}`
            )
            .leftJoin(
                `${USERS.NAME} as ${USERS.NAME}`,
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.CREATED_BY}`,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`
            )
            .where(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.COMPANY_ID}`,
                company_id
            )
            .whereBetween(
                `${OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_DATE}`,
                [from_date, to_date]
            )
            .orderBy(`${REGION.NAME}.${REGION.COLUMNS.ID}`, "ASC");


        if (region_id != -1) {
            query.where(
                `${REGION.NAME}.${REGION.COLUMNS.ID}`,
                region_id
            );
        }

        if (outlet_id && Array.isArray(outlet_id) && outlet_id.length > 0) {
            query.whereIn(
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
                outlet_id
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outlet PO Status List",
            logTrace
        });

        const response = await query.paginate({
            pageSize: page_size,
            currentPage: current_page
        });

        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const purhcase_memo_temp_details = await Promise.all(
            response.data.map(async temp => {

                const purchase_memo_temp_lines = await knex
                    .select([
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_CODE}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UOM_ID}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_QTY}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_QTY}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PO_MRP}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_MRP}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.MEMO_RETURN_QTY}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                    ])
                    .from(`${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME} as ${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.PROD_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`,
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.UOM_ID}`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
                    )
                    .where(
                        `${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID}`,
                        temp.id
                    );

                return { ...temp, purchase_memo_temp_lines };

            })
        );
        return {
            data: purhcase_memo_temp_details,
            pagination: response.meta.pagination
        };
    }
    return {
        postOutletPurchaseMemoTempRepo,
        getOutletPurchaseMemoTempRepo,
        getAllOutletPurchaseMemoTempRepo,
        deleteOutletPurchaseMemoTempRepo,
        getOutletPurchaseMemoProductTempRepo,
        deleteOutletPurchaseMemoProductTempRepo,
        getAllOutletPurchaseMemoSummaryTempRepo,
        getOutletPurchaseMemoTempReportRepo
    };
}
module.exports = OutletRepo

