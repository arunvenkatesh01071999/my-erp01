const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { OUTLET_PURCHASE_MEMO_MASTER, OUTLET_PURCHASE_MEMO_DETAILS, OUTLET_PURCHASE_MEMO_BATCH_DETAILS } = require("../commons/constants")
const { SUPPLIER } = require("../../catalog/item/commons/constants")
const { OUTLET_PRODUCT_MAPPING, ITEM, WAREHOUSE_OUTLET_MAPPING, BARCODE_LIST } = require("../../catalog/commons")
const { UNITS } = require("../../catalog/units/commons/constants");
const _ = require('lodash');
const { SUPPLIER_OUTLET_MAPPING, OUTLET_PO_MASTER, OUTLET_PO_DETAILS } = require("../../outlet_po/Outlet_po_auto/commons/constants");
const { OUTLETS } = require("../../accounts/outlets/commons/constants");
const { USERS } = require("../../accounts/admin/commons/constants");
const { httpClient } = require("../../plugins/httpClient/axios");
const { OUTLET_PURCHASE_MEMO_MASTER_TEMP,
    OUTLET_PURCHASE_MEMO_DETAILS_TEMP,
    OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP } = require('../../outlet_memo_temp/commons/constants')
const { OUTLET_PURCHASE_MASTER, OUTLET_PURCHASE_DETAILS, } = require('../../outlet_purchase/commons/constants')

function OutletRepo(fastify) {

    async function getOutletMemoSupplierListRepo({ params, logTrace }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex
            .select([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`
            ])
            .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
            .innerJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
            )
            // supplier_outlet_mapping - outlet_supplier_orderdays
            .innerJoin(
                `${OUTLET_PO_MASTER.NAME}`,
                function () {
                    this.on(
                        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
                        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
                    )
                        .andOn(
                            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
                            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
                        );
                }
            )
            .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
            .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 1)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY}`, '>', 0)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_MEMO_COMPLETE}`, false)
            .groupBy([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`
            ])
            .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "Asc");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outlet Memo Suppliers list",
            logTrace
        });

        const response = await query;

        if (!response || response.length == 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Supplier not found`,
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function getOutletMemoPoNoListRepo({ params, logTrace, body, userDetails }) {
        const knex = this;
        const { supplier_id, outlet_id } = params;

        const query = knex
            .select([
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE} as po_date`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_BY}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNEE_NAME}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_ASSIGNED_AT}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`
            ])
            .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, Number(supplier_id))
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_MEMO_COMPLETE}`, false)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 1)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY}`, '>', 0)
            .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, "asc")

        let response = await query;

        if (!response || response.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `outlet purchase order number not found`,
                code: "NOT_FOUND"
            });
        }
        console.log("response", response)
        console.log("response", userDetails)
        const finalResponse = response.map((e) => ({
            ...e,
            po_assigned: Number(e.po_assigned_by) !== 0 && Number(e.po_assigned_by) !== Number(userDetails.id)
        }));

        return finalResponse;
    }

    async function getOutletMemoPoItemListRepo({ params, queryString, userDetails, logTrace }) {
        const knex = this;
        const { po_no, outlet_id, supplier_id } = params;
        const { search } = queryString;


        const existingPODetails = await knex(OUTLET_PO_MASTER.NAME)
            .where({
                [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
                [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
                [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id
            })
            .first();

        // 1. PO not found check
        if (!existingPODetails) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Purchase Order ${po_no} not found`,
                property: "Purchase Order Number",
                code: "NOT_FOUND"
            })
        }

        const { po_assigned, po_assigned_by, po_assignee_name } = existingPODetails;
        console.log("existingPODetails", existingPODetails)
        // 2. Assignment validation
        if (po_assigned && Number(po_assigned_by) !== Number(userDetails.id)) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: `PO ${po_no} is already assigned to ${po_assignee_name}`,
                property: "User Name",
                code: "NOT_ACCEPTABLE"
            })
        }

        console.log("userDetails", userDetails)



        const query = knex
            .select([
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID} as product_id`,
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as product_code`,
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_NAME} as product_name`,
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY} as po_order_qty`,
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP} as po_mrp`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} as uom_id`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                knex.raw(`0 as invoice_amount`),
                knex.raw(`'' as image_url`)
            ])
            .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`
            )
            .innerJoin(
                `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`,
                function () {
                    this.on(
                        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`,
                        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
                    )
                        .andOn(
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
                        )
                        .andOn(
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
                            knex.raw('?', [supplier_id])
                        );
                }
            )
            .leftJoin(
                `${UNITS.NAME} as ${UNITS.NAME}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
            )
            .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, po_no)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outlet_id)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`, supplier_id)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_COMPLETE}`, false)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_TEMP}`, false)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY}`, '>', 0)
            .orderByRaw(
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}::int asc`
            );



        if (search && search.length >= 1) {
            query.where(function () {
                this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`)
                    .orWhereRaw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS TEXT) ILIKE ?`, [`%${search}%`])
                    .orWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE}`, "ilike", `%${search}%`)
            })
        }

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase order items not found",
                property: "Purchase Order Number",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function postOutletPurchaseMemoRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;

        const trx = await knex.transaction();

        try {
            const { supplier_id, outlet_id, pono, invoice_amount } = body
            //step 1: get supplier details
            const supplierDetails = await knex(SUPPLIER.NAME)
                .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
                .where(SUPPLIER.COLUMNS.ID, supplier_id)
                .first()

            const { gst_type } = supplierDetails;

            // step-2 : get warehouse details
            const whDetails = await knex(WAREHOUSE_OUTLET_MAPPING.NAME)
                .select(`${WAREHOUSE_OUTLET_MAPPING.NAME}.${WAREHOUSE_OUTLET_MAPPING.COLUMNS.WAREHOUSE_ID}`)
                .where(WAREHOUSE_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
                .first()

            const { warehouse_id } = whDetails;

            // step-3 : insert outlet memo master
            const [purchaseResponse] = await trx(`${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.WAREHOUSE_ID]: warehouse_id,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.STATUS]: 0,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO]: body.party_invoice_no,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE]: body.party_invoice_date,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_AMOUNT]: body.invoice_amount,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CUSTOMER_TYPE]: gst_type,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO]: body.pono,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PODATE]: body.podate,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL]: body.image_url,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_ACTIVE]: true,
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CREATED_BY]: userDetails.id
                });

            if (!purchaseResponse?.id && !purchaseResponse[0]?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Failed to insert into purchase grn details ",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const purchase_id = purchaseResponse?.id || purchaseResponse[0]?.id;
            const docno = `${purchase_id}`;


            // step-4 : update outlet memo master docno
            const updatedRows = await trx(`${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
                .where(`${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID}`, purchase_id)
                .update({
                    [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DOCNO]: docno
                });

            if (updatedRows === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Failed to update document number",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            let subTotalAmount = 0;
            let totalGstAmount = 0;
            let totalIgstAmount = 0;
            let totalCessAmount = 0;
            let totalReturnAmount = 0;
            let totalPoReturnAmount = 0;
            let roundedTotal = 0;
            let totalOrderQty = 0;
            let totalReceivedQty = 0;
            let totalReturnQty = 0;
            let totalPoReturnQty = 0;
            let roundOff = 0;
            const productDetailsMap = {};


            // step-5 : insert outlet memo details
            if (Array.isArray(body.purchase_memo_details) && body.purchase_memo_details.length > 0) {

                const allGrnDetailsData = [];

                for (const element of body.purchase_memo_details) {
                    const product_id = Number(element.product_id) || 0;
                    const po_no = Number(body.pono) || 0;
                    const supplierId = Number(body.supplier_id) || 0;
                    const outletId = Number(body.outlet_id) || 0;
                    const productDetails = await trx(`${OUTLET_PO_DETAILS.NAME} AS ${OUTLET_PO_DETAILS.NAME}`)
                        .select([
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID} AS category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID} AS sub_category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} AS brand_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} AS brand_company_id`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE} AS barcode`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} AS pur_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.HSN} AS hsn`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE} AS sale_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.CESS} AS cess`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST} AS gst`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP} AS mrp`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
                        ])
                        .innerJoin(
                            `${OUTLET_PRODUCT_MAPPING.NAME}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`
                        )
                        .innerJoin(
                            `${ITEM.NAME}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`
                        )
                        .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, po_no)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`, product_id)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletId)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`, supplierId)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_COMPLETE}`, false)
                        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
                        .first();

                    if (!productDetails) {
                        throw new Error(`No product mapping found for product_id ${element.product_id}`);
                    }

                    const purchaseRate = Number(productDetails.pur_rate) || 0;
                    const gst = Number(productDetails.gst) || 0;
                    const cess = Number(productDetails.cess) || 0;
                    const memoMRP = Number(element.memo_mrp) || 0;
                    const poMrp = Number(element.po_mrp) || 0;

                    const orderQty = Number(element.order_qty) || 0;
                    const receivedQty = Number(element.received_qty) || 0;
                    const returnQty = Number(element.return_qty) || 0;
                    const qty = Number(receivedQty + returnQty);
                    const poReturnQty = Number(orderQty - qty);
                    const acceptedMargin = Number(productDetails.fixedmargin) || 0;

                    productDetailsMap[element.product_id] = {
                        purchase_rate: purchaseRate,
                        gst,
                        cess,
                        hsn: productDetails.hsn,
                        sale_rate: Number(productDetails.sale_rate) || 0,
                        margin: acceptedMargin
                    };

                    const gstAmount = Number(gst_type) === 2 ? (purchaseRate * gst * qty) / 100 : 0;
                    const igstAmount = Number(gst_type) === 1 ? (purchaseRate * gst * qty) / 100 : 0;
                    const cessAmount = (purchaseRate * cess * qty) / 100;
                    const returnAmount = returnQty * purchaseRate;
                    const poReturnAmount = poReturnQty * purchaseRate;
                    const amount = qty * purchaseRate;

                    subTotalAmount += amount;
                    totalGstAmount += gstAmount;
                    totalIgstAmount += igstAmount;
                    totalCessAmount += cessAmount;
                    totalReturnAmount += returnAmount;
                    totalPoReturnAmount += poReturnAmount;
                    totalOrderQty += orderQty;
                    totalReceivedQty += qty;
                    totalReturnQty += returnQty;
                    totalPoReturnQty += totalPoReturnQty;

                    allGrnDetailsData.push({
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_PURCHASE_MEMO_MST_ID]: purchase_id,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.DOCNO]: docno || '',
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.DOCDATE]: new Date(),
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO]: body.pono,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_ID]: element.product_id,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.HSN_CODE]: productDetails.hsn,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_CODE]: element.prod_code || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SUB_CAT_ID]: productDetails.sub_category_id || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CAT_ID]: productDetails.category_id || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.HEAD_ID]: productDetails.brand_id || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.TYPE_DESIGN_ID]: productDetails.brand_company_id || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UOM_ID]: productDetails.uom_id || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.BARCODE]: productDetails.barcode || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ORDER_QTY]: element.order_qty || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RECIVED_QTY]: receivedQty,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RETURN_QTY]: returnQty,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.QTY]: qty,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.FREE_QTY]: element.free_qty || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PURCHASE_RATE]: purchaseRate,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.AMOUNT]: amount,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ACCEPTED_MARGIN]: acceptedMargin,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RETURN_AMOUNT]: returnAmount,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.WAREHOUSE_ID]: body.wh_id || 1,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.MRP]: memoMRP,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SALE_RATE]: parseFloat(productDetails.sale_rate) || 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? gst : 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? gstAmount : 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CGST]: Number(gst_type) === 2 ? Number(gst) / 2 : 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SGST]: Number(gst_type) === 2 ? Number(gst) / 2 : 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? gst : 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 1 ? igstAmount : 0,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CESS]: cess,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.TYPE_ID]: productDetails.type_id,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_MRP]: poMrp,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
                    });
                }

                const totalBeforeRoundOff =
                    Number(subTotalAmount.toFixed(2)) +
                    Number(totalGstAmount.toFixed(2)) +
                    Number(totalIgstAmount.toFixed(2)) +
                    Number(totalCessAmount.toFixed(2));

                roundedTotal = Math.round(totalBeforeRoundOff);
                roundOff = Number((roundedTotal - totalBeforeRoundOff).toFixed(2));

                await trx(OUTLET_PURCHASE_MEMO_MASTER.NAME)
                    .where("id", purchase_id)
                    .update({
                        grand_total_amt: roundedTotal,
                        sub_total_amt: subTotalAmount,
                        total_gst_amt: Number(gst_type) === 2 ? totalGstAmount : 0,
                        total_igst_amt: Number(gst_type) === 1 ? totalIgstAmount : 0,
                        total_cess_amt: totalCessAmount,
                        total_return_amt: totalReturnAmount,
                        total_order_qty: totalOrderQty,
                        total_received_qty: totalReceivedQty,
                        total_return_qty: totalReturnQty,
                        // total_memo_qty: totalFinalQty,
                        roff: roundOff
                    });

                if (allGrnDetailsData.length > 0) {
                    console.log("allGrnDetailsData", allGrnDetailsData)
                    await trx.batchInsert(OUTLET_PURCHASE_MEMO_DETAILS.NAME, allGrnDetailsData, 1000);
                }
            }



            // step-6 : insert outlet memo  batch details
            if (Array.isArray(body.purchase_memo_details) && body.purchase_memo_details.length > 0) {
                const purchaseGrnChunks = _.chunk(body.purchase_memo_details, 500);
                for (const grnChunk of purchaseGrnChunks) {
                    await Promise.all(grnChunk.map(async (element) => {
                        if (Array.isArray(element.memo_batch_details)) {

                            const batchDetailsMap = new Map();
                            for (const element1 of element.memo_batch_details) {
                                const key = `${purchase_id} -${element.product_id} -${element1.batch_no} `;
                                if (!batchDetailsMap.has(key)) {
                                    batchDetailsMap.set(key, {
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.OUTLET_PO_MEMO_MST_ID]: purchase_id,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.PRODUCT_CODE]: element.prod_code,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.QTY]: Number(element1.qty) || 0,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.MRP]: Number(element1.mrp) || 0,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS]: 0,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.RETURN_QTY]: Number(element1.return_qty) || 0,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: element1.manufacture_date,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: Number(element1.expiry_type) || 1,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: element1.expiry_value || 0,
                                        [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: element1.exp_date || new Date()
                                    });

                                }
                            }

                            const batchDetailsData = Array.from(batchDetailsMap.values());

                            if (batchDetailsData.length > 0) {
                                await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS.NAME)
                                    .insert(batchDetailsData)
                                    .onConflict([
                                        OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.OUTLET_PO_MEMO_MST_ID,
                                        OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.PRODUCT_ID,
                                        OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.BATCH_NO
                                    ])
                                    .merge();
                            }

                        }
                    }));

                }

            }

            // ---------------- OVERALL COMPARISON ----------------
            const invoiceAmt = Math.floor(Number(invoice_amount) || 0);
            const memoInvoiceAmt = Math.floor(Number(roundedTotal) || 0);

            const isQtyEqual = Number(totalOrderQty) === Number(totalReceivedQty);
            const isAmountEqual = invoiceAmt === memoInvoiceAmt;
            const hasReturn = Number(totalReturnQty) > 0;

            // ---------------- MRP CHECK ----------------
            let mrp_verify_flag = false;

            if (Array.isArray(body.purchase_memo_details)) {
                for (const el of body.purchase_memo_details) {
                    if (Number(el.memo_mrp) !== Number(el.po_mrp)) {
                        mrp_verify_flag = true;
                        break;
                    }
                }
            }

            // ---------------- FLAGS ----------------
            let memoInserted = false;
            let qtyMismatch = false;
            let mrpMismatch = false;
            let debiteNote = false;


            // ---------------- FINAL SWITCH ----------------
            switch (true) {

                // ✅ CASE 1: Perfect – No return, qty & amount match
                case (isQtyEqual && isAmountEqual && !hasReturn && !mrp_verify_flag):
                    memoInserted = true;
                    qtyMismatch = false;
                    break;

                // ✅ CASE 2: Any return exists, but invoice & memo amount match
                case (hasReturn):
                    memoInserted = true;
                    qtyMismatch = true;     // return implies qty difference
                    break;


                // ✅ CASE 3: Pure MRP / rate mismatch
                case (mrp_verify_flag):
                    mrpMismatch = true;
                    break;

                // ✅ CASE 4: Pure MRP / rate mismatch
                case (!isAmountEqual && !mrp_verify_flag):
                    memoInserted = true;
                    break;

                default:
                    memoInserted = false;
            }

            console.log("memoInserted:", memoInserted);
            console.log("qtyMismatch:", qtyMismatch);
            console.log("invoiceAmt:", invoiceAmt);
            console.log("memoInvoiceAmt:", memoInvoiceAmt);
            console.log("totalAdjustedAmt:", totalPoReturnAmount);
            console.log("debiteNote:", debiteNote);
            console.log("mrpMismatch:", mrpMismatch);

            if (Number(totalOrderQty) && Number(totalReceivedQty)) {

                const existingPO = await trx(OUTLET_PO_MASTER.NAME)
                    .where(OUTLET_PO_MASTER.COLUMNS.PO_NO, String(pono))
                    .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
                    .first();

                if (existingPO) {
                    const poMasterUpdate = {
                        [OUTLET_PO_MASTER.COLUMNS.IS_MEMO_COMPLETE]: true,
                        [OUTLET_PO_MASTER.COLUMNS.MEMO_NO]: trx.raw(
                            "COALESCE(memo_no, '') || ? || ','",
                            [docno]
                        )
                    };

                    if ((Boolean(memoInserted) === true) && (Boolean(qtyMismatch) === false)) {
                        poMasterUpdate[OUTLET_PO_MASTER.COLUMNS.IS_NORMAL] = true;
                    }

                    if ((Boolean(memoInserted) === true) && (Boolean(qtyMismatch) === true)) {
                        poMasterUpdate[OUTLET_PO_MASTER.COLUMNS.IS_QTY_MISMATCH] = true;
                    }

                    if (Boolean(mrpMismatch) === true) {
                        poMasterUpdate[OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT] = true;
                        poMasterUpdate[OUTLET_PO_MASTER.COLUMNS.TYPE] = "memo";
                    }

                    // Update PO master
                    await trx(OUTLET_PO_MASTER.NAME)
                        .where(OUTLET_PO_MASTER.COLUMNS.PO_NO, String(body.pono))
                        .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
                        .update(poMasterUpdate);

                    // Step 6: Update Outlet Purchase Item Stock
                    if (_.isArray(body.purchase_memo_details)) {
                        await Promise.all(
                            _.map(body.purchase_memo_details, async (element) => {
                                const outletPoDetails = await knex(OUTLET_PO_DETAILS.NAME)
                                    .select(
                                        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP}`,
                                        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST}`,
                                        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN}`,
                                        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE}`,
                                        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE}`

                                    )
                                    .where(OUTLET_PO_DETAILS.COLUMNS.PO_NO, String(pono))
                                    .where(OUTLET_PO_DETAILS.COLUMNS.PROD_ID, Number(element.product_id))
                                    .where(OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID, outlet_id)
                                    .first()
                                // --------------------------------------------------------
                                // 3️⃣ Purchase Rate Calculation
                                // --------------------------------------------------------
                                const mrp = Number(element?.memo_mrp) || 0;
                                const margin = Number(outletPoDetails?.fixedmargin) || 0;
                                const discountType = Number(outletPoDetails?.vendordiscounttype) || 0;
                                const discountValue = Number(outletPoDetails?.vendordiscountvalue) || 0;
                                let purchaseRate = Number(outletPoDetails?.purchase_rate) || 0;
                                let gstPercentage = Number(outletPoDetails?.gst) || 0;
                                let memo_qty = Number(element.received_qty) || 0;
                                console.log("outletPoDetails", outletPoDetails)
                                console.log("mrp", mrp)
                                console.log("margin", margin)
                                console.log("discountType", discountType)
                                console.log("discountValue", discountValue)

                                let landingPrice = 0;
                                let basicPrice = 0;

                                // if (margin > 0) {
                                landingPrice = mrp - (mrp * margin / 100);
                                // Apply discount
                                if (discountType === 1) {
                                    // Percentage discount
                                    landingPrice = Number(landingPrice - (mrp * discountValue / 100));
                                } else if (discountType === 0) {
                                    // Flat value discount
                                    landingPrice = Number(landingPrice - discountValue);
                                }
                                landingPrice = Number(landingPrice.toFixed(3));
                                basicPrice = Number((landingPrice / (1 + gstPercentage / 100)).toFixed(2));


                                console.log("discountValue", purchaseRate)
                                const poDetailsUpdate = {
                                    [OUTLET_PO_DETAILS.COLUMNS.MEMO_MRP]: mrp,
                                    [OUTLET_PO_DETAILS.COLUMNS.MEMO_COST_PRICE]: basicPrice,
                                    [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: memo_qty,
                                    [OUTLET_PO_DETAILS.COLUMNS.IS_MEMO_COMPLETE]: true,
                                    [OUTLET_PO_DETAILS.COLUMNS.RECEIVED_MEMO_QTY]: memo_qty
                                };

                                // Update PO master
                                await trx(OUTLET_PO_DETAILS.NAME)
                                    .where(OUTLET_PO_DETAILS.COLUMNS.PO_NO, String(body.pono))
                                    .where(OUTLET_PO_DETAILS.COLUMNS.PROD_ID, Number(element.product_id))
                                    .where(OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID, outlet_id)
                                    .update(poDetailsUpdate);
                            })
                        );
                    }

                }
            }


            const masterTempData = await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                .where({
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.PO_NO]: body.pono,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.SUPPLIER_ID]: body.supplier_id
                })
                .first();


            if (masterTempData?.id) {
                await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.NAME)
                    .where(
                        OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                        masterTempData.id
                    )
                    .del();

                await trx(OUTLET_PURCHASE_MEMO_DETAILS_TEMP.NAME)
                    .where(
                        OUTLET_PURCHASE_MEMO_DETAILS_TEMP.COLUMNS.OP_MEMO_MST_TEMP_ID,
                        masterTempData.id
                    )
                    .del();

                await trx(OUTLET_PURCHASE_MEMO_MASTER_TEMP.NAME)
                    .where(
                        OUTLET_PURCHASE_MEMO_MASTER_TEMP.COLUMNS.ID,
                        masterTempData.id
                    )
                    .del();
            }



            await trx.commit();

            function toPgDate(value) {
                if (!value) return null;

                const date = new Date(value);
                if (isNaN(date.getTime())) return null;

                return date.toISOString().slice(0, 10); // YYYY-MM-DD
            }

            let purchasePayload = null;
            let base_url = null;
            let token = null;
            let shouldCallPurchaseAPI = false;

            // /**
            //  * Decide payload using switch(true)
            //  */
            function buildPurchasePayload(type = "NORMAL") {

                const isQtyMismatch = type === "QTY_MISMATCH";


                return {
                    supplier_id: body.supplier_id,
                    company_id: body.company_id || 1,
                    outlet_id: body.outlet_id,
                    wh_id: warehouse_id,

                    invoice_no: body.party_invoice_no,
                    invoice_date: body.party_invoice_date,

                    pono: body.pono,
                    podate: body.podate,

                    memo_no: docno,
                    memo_date: toPgDate(new Date()),
                    memo_invoice_amt: memoInvoiceAmt,
                    remark: isQtyMismatch
                        ? "Quantity Mismatch"
                        : (body.remark || "Normal"),
                    total_items: body.purchase_memo_details.length,
                    purchase: true,
                    purchase_return: isQtyMismatch ? true : false,
                    is_debit_note: false,
                    total_debit_note_amount: 0,
                    outlet_purchase_details: body.purchase_memo_details.map((element) => {
                        const orderQty = Number(element.order_qty) || 0;
                        const receivedQty = Number(element.received_qty) || 0;
                        const returnQty = Number(element.return_qty) || 0;
                        const qty = receivedQty + returnQty;
                        const p = productDetailsMap[element.product_id] || {};

                        return {
                            product_id: Number(element.product_id),
                            product_code: String(element.prod_code),
                            orderQty,
                            qty,
                            return_qty: returnQty,
                            free_qty: Number(element.free_qty) || 0,
                            mrp: Number(element.memo_mrp) || 0,
                            mrp_mismatch_flag: false,
                            purchase_rate: p.purchase_rate || 0,
                            gst: p.gst || 0,
                            cess: p.cess || 0,
                            hsn: p.hsn,
                            sale_rate: p.sale_rate || 0,
                            accepted_margin: p.margin || 0,
                            self_life_qty: 0,

                            outlet_purchase_batch_details: Array.isArray(element.memo_batch_details)
                                ? element.memo_batch_details.map(batch => ({
                                    batch_no: String(batch.batch_no),
                                    qty: Number(batch.qty) || 0,
                                    mrp: Number(batch.mrp) || 0,
                                    self_life_qty: 0,
                                    return_qty: Number(batch.return_qty) || 0
                                }))
                                : []
                        };
                    })
                };
            }

            switch (true) {

                // ✅ CASE 1: Normal
                case (memoInserted && !qtyMismatch):
                    base_url = process.env.BASE_URL;
                    token = process.env.TOKEN;
                    shouldCallPurchaseAPI = true;
                    purchasePayload = buildPurchasePayload("NORMAL");
                    break;

                // ✅ CASE 2: Qty mismatch (no debit note)
                case (memoInserted && qtyMismatch):
                    base_url = process.env.BASE_URL;
                    token = process.env.TOKEN;
                    shouldCallPurchaseAPI = true;
                    purchasePayload = buildPurchasePayload("QTY_MISMATCH");
                    break;

                // // ✅ CASE 3: Qty mismatch + Debit Note
                // case (memoInserted && qtyMismatch && !mrpMismatch && debiteNote):
                //     base_url = process.env.BASE_URL;
                //     token = process.env.TOKEN;
                //     shouldCallPurchaseAPI = true;
                //     purchasePayload = buildPurchasePayload("DEBIT_NOTE");
                //     break;

                // ❌ CASE 4: MRP mismatch → No API call
                case (mrpMismatch):
                    shouldCallPurchaseAPI = false;
                    break;

                default:
                    shouldCallPurchaseAPI = false;
                    break;
            }

            console.log(purchasePayload, "purchase payload")

            // /** * Call Purchase API only if required*/
            // ✅ CASE: MRP mismatch ONLY → Amendment flow
            if (mrpMismatch === true) {
                return {
                    success: true,
                    message: "Purchase memo inserted. MRP moved to outlet amendment.",
                    docno
                };
            }

            // ✅ CASE: Call Purchase API
            if (shouldCallPurchaseAPI === true) {
                try {
                    const response = await httpClient({
                        url: `${base_url}/outlet/purchase`,
                        method: "POST",
                        body: purchasePayload,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response?.data?.success === true) {
                        return {
                            success: true,
                            message: "Outlet Purchase Memo And GRN Inserted Successfully",
                            docno
                        };
                    }

                    return {
                        success: false,
                        message: response?.data?.message || "Purchase API failed"
                    };

                } catch (error) {

                    console.log('error', error);

                    return {
                        success: false,
                        message: "Purchase API call failed"
                    };
                }
            }

            // ❌ FALLBACK: No API call & no amendment
            return {
                success: true,
                message: "Purchase memo processed successfully",
                docno
            };

        } catch (error) {
            await trx.rollback();
            console.error("Error in outlet purchase memo:", error);
            if (error?._code === 404 || error?._code === 400) {
                throw error;
            }
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Outlet Purchase Memo transaction failed.",
                property: "",
                code: "OUTLET_PURCHASE_MEMO_FAILED",
            });
        }
    }

    async function getOutletPurchaseMemoDetailsRepo({ params, body }) {
        const knex = this;
        const { memo_no, outlet_id } = params;

        const master = await knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .distinct([
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DOCNO} as memo_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID} as id`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.GRAND_TOTAL_AMT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUB_TOTAL_AMT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_ORDER_QTY}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_RECEIVED_QTY}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.REMARK}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.RETURN_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.RETURN_REMARK}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DISCOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OTHER_CHARGES}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_GST_AMT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_IGST_AMT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ADVANCE}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_CESS_AMT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TCS}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ROFF}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`,
            ])
            .leftJoin(
                OUTLETS.NAME,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                SUPPLIER.NAME,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID}`
            )
            .leftJoin(
                USERS.NAME,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CREATED_BY}`
            )
            .where(
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DOCNO}`,
                String(memo_no)
            )
            .andWhere(
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`,
                Number(outlet_id)
            )
            .first();

        if (!master) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlet Purchase Memo ${memo_no} not found for outlet ${outlet_id}`,
                property: "memo_no",
                code: "NOT_FOUND"
            });
        }

        const memo_item_details = await knex(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_ID} as product_id`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_CODE} as product_code`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.BARCODE}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.HSN_CODE}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.DISCOUNT}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PURCHASE_RATE}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ACCEPTED_MARGIN}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SALE_RATE}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IGST}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IGST_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CGST}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SGST}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CESS}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CESS_AMOUNT}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ORDER_QTY} as po_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RECIVED_QTY} as memo_qty`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.MRP} as memo_mrp`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_MRP} as po_mrp`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UOM_ID} as uom_id`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`
            ])
            .innerJoin(
                ITEM.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_ID}`
            )
            .innerJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UOM_ID}`
            )
            .where(
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_PURCHASE_MEMO_MST_ID}`,
                master?.id
            );



        if (memo_item_details.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Outlet Purchase Memo ${memo_no}`,
                property: "items",
                code: "NOT_FOUND"
            });
        }


        const batchRows = await knex(OUTLET_PURCHASE_MEMO_BATCH_DETAILS.NAME)
            .where(
                OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.OUTLET_PO_MEMO_MST_ID,
                Number(master?.id)
            );


        if (batchRows.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Outet Purchase Memo ${memo_no}`,
                property: "items",
                code: "NOT_FOUND"
            });
        }


        // -----------------------------
        // STEP 5: Merge Items + Batches
        // -----------------------------
        const mergedItems = memo_item_details.map(item => ({
            ...item,
            memo_item_batch_details: batchRows
                .filter(b => b.product_id === item.product_id && b.memo_mrp === item.mrp)
                .map(b => ({
                    batch_no: b.batch_no,
                    mrp: b.mrp,
                    qty: b.qty,
                    expiry_date: b.expiry_date,
                    manufacture_date: b.manufacture_date
                }))
        }));


        return {
            memo_no: master.memo_no,
            grand_total_amt: master.grand_total_amt ?? 0,
            sub_total_amt: master.sub_total_amt ?? 0,
            invoice_no: master.invoice_no ?? "",
            invoice_date: master.invoice_date ?? null,
            total_order_qty: master.total_order_qty ?? 0,
            total_received_qty: master.total_received_qty ?? 0,
            remark: master.remark ?? "",
            return_amount: master.return_amount ?? 0,
            return_remark: master.return_remark ?? "",
            discount: master.discount ?? 0,
            roff: master.roff ?? 0,
            other_charges: master.other_charges ?? 0,
            total_gst_amt: master.total_gst_amt ?? 0,
            total_igst_amt: master.total_igst_amt ?? 0,
            total_cess_amt: master.total_cess_amt ?? 0,
            advance: master.advance ?? 0,
            tcs: master.tcs ?? 0,
            invoice_amount: master.invoice_amount ?? 0,
            image_url: master.image_url ?? null,
            outlet_name: master.outlet_name ?? null,
            supplier_name: master.supplier_name ?? null,
            user_name: master.user_name ?? null,
            memo_item_details: mergedItems
        };
    }


    async function putOutletPurchaseMemoInvoicePdfRepo({ body, params, logTrace, userDetails }) {
        const knex = this;
        const { outlet_id, supplier_id, po_no } = params;
        const { remark } = body;

        const query = knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, po_no)
            .first()

        const exists_response = await query;

        if (!exists_response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "invoice pdf not found to update",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query_update = await knex(`${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, po_no)
            .update({
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_REMARK]: remark,
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_INVOICE_PDF]: false,
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL]: "",
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CLEAR_INVOICE_USER]: userDetails?.id || 1
            });

        const response = await query_update;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while updating invoice pdf",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }

        return { success: true };
    }

    async function putOutletPurchaseMemoInvoicePdfUploadRepo({ body, params, logTrace, userDetails }) {
        const knex = this;
        const { outlet_id, supplier_id, po_no } = params;
        const { invoice_url } = body;

        const query = knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, po_no)
            .first()

        const exists_response = await query;

        if (!exists_response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "invoice pdf not found to update",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query_update = await knex(`${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, po_no)
            .update({
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_INVOICE_PDF]: true,
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_REMARK]: "",
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL]: invoice_url,
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPLOAD_INVOICE_USER]: userDetails?.id || 1
            });

        const response = await query_update;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while updating invoice pdf",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }

        return { success: true };
    }

    async function getOutletMemoInvoicePdfUploadSummaryListRepo({ params, body, logTrace, userDetails, querystring }) {
        const knex = this;
        const { outlet_id } = params;
        const { page = 1, pageSize = 10 } = querystring;

        const user_id = userDetails?.id;
        
        const offset = (page - 1) * pageSize;

        // 🔹 total count
        const [{ total }] = await knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .count("* as total")
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CREATED_BY, user_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_INVOICE_PDF, false);


        const masters = await knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .select([
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DOCNO} as memo_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.DOCDATE} as memo_date`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO} as pono`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PODATE} as podate`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO} as party_invoice_no`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE} as party_invoice_date`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_AMOUNT} as invoice`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_REMARK}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_INVOICE_PDF}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`
            ])
            .leftJoin(
                OUTLETS.NAME,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`
            )
            .leftJoin(
                SUPPLIER.NAME,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID}`
            )
            .leftJoin(
                USERS.NAME,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CREATED_BY}`
            )
            .where(
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`,
                outlet_id
            )
            .andWhere(
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.CREATED_BY}`,
                user_id
            )
            .andWhere(
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_INVOICE_PDF}`,
                false
            )
            .orderBy(
                `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID}`,
                "desc"
            )
            .limit(pageSize)
            .offset(offset);

        return {
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            },
            data: masters
        };
    }


    async function putOutletPurchaseMemoInvoiceNoRepo({ body, params, logTrace, userDetails }) {
        const knex = this;
        const { outlet_id, po_no } = params;
        const { invoice_no, invoice_date } = body

        const query = knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, po_no)
            .first()

        const exists_response = await query;

        if (!exists_response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_ACCEPTABLE,
                message: "invoice no not found to update",
                property: "",
                code: "NOT_ACCEPTABLE"
            });
        }

        const query_update = await knex(`${OUTLET_PURCHASE_MEMO_MASTER.NAME}`)
            .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, po_no)
            .update({
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO]: invoice_no,
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE]: invoice_date,
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPLOAD_INVOICE_USER]: userDetails?.id || 1
            });

        const response = await query_update;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_IMPLEMENTED,
                message: "Error while updating invoice pdf",
                property: "",
                code: "NOT_IMPLEMENTED"
            });
        }

        const query1 = knex(OUTLET_PURCHASE_MASTER.NAME)
            .where(OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID, outlet_id)
            .andWhere(OUTLET_PURCHASE_MASTER.COLUMNS.PONO, po_no)
            .first()

        const exists_response_grn = await query1;

        if (exists_response_grn) {
            const update_grn_invoice_no = await knex(`${OUTLET_PURCHASE_MASTER.NAME}`)
                .where(OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID, outlet_id)
                .andWhere(OUTLET_PURCHASE_MASTER.COLUMNS.PONO, po_no)
                .update({
                    [OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO]: invoice_no,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_DATE]: invoice_date,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE_SYNC]: 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                    [OUTLET_PURCHASE_MASTER.COLUMNS.UPDATED_BY]: userDetails?.id || 1
                });
        }

        
        return { success: true };
    }
    return {
        getOutletMemoSupplierListRepo,
        getOutletMemoPoNoListRepo,
        getOutletMemoPoItemListRepo,
        postOutletPurchaseMemoRepo,
        getOutletPurchaseMemoDetailsRepo,
        putOutletPurchaseMemoInvoicePdfRepo,
        putOutletPurchaseMemoInvoicePdfUploadRepo,
        getOutletMemoInvoicePdfUploadSummaryListRepo,
        putOutletPurchaseMemoInvoiceNoRepo
    };
}
module.exports = OutletRepo
