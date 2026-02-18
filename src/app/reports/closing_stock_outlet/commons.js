
const CLOSINGSTOCK_W = {
    NAME: "closing_stock",
    COLUMNS: {
        ID: "id",
        DOCDATE: "docdate",
        PRODID: "prodid",
        PHYSICAL_QTY: "physical_qty",
        COMPUTER_QTY: "computer_qty",
        PURCHASE_RATE: "purchase_rate",
        SALES_RATE: "sales_rate",
        MRP: "mrp",
        UID: "uid",
        OUTLET_ID: "outlet_id",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};


const CLOSING_STOCK_TEMP = {
    NAME: "closing_stock_temp",
    COLUMNS: {
        ID: "id",
        PROD_ID: "prod_id",
        CAT_ID: "cat_id",
        SUB_CAT_ID: "sub_cat_id",
        BARCODE: "barcode",
        OUTLET_ID: "outlet_id",
        SALES_MAN_ID: "sales_man_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

module.exports = {
    CLOSINGSTOCK_W,
    CLOSING_STOCK_TEMP

};