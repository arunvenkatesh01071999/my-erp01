const PRODUCT = {
  NAME: "Product",
  COLUMNS: {
    PRODUCT_ID: "ProdId",
    M_UNIT: "Munit",
    MCAT_ID: "Mcatid",
    PROD_CODE: "ProdCode",
    PROD_NAME: "ProdName",
    SCAT_ID: "Scatid",
    BID: "Bid",
    UOM_ID: "Uomid",
    S_RATE: "SRate",
    MRP: "Mrp",
    IMG_PATH: "ImgPath",
    STOCK: "Stock",
    ACTIVE: "Active",
    DRATE: "drate",
    WT: "wt",
    IMG_PATH1: "ImgPath1",
    IMG_PATH2: "ImgPath2",
    IMG_PATH3: "ImgPath3",
    IMG_PATH4: "ImgPath4",
    M_CID: "mcid",
    OUTLET: "outlet",
    UNMAP: "unmap",
    ITYPE: "itype",
    STAT: "stat"
  }
};

const PRODUCT_PACK = {
  NAME: "Productpack",
  COLUMNS: {
    PRODUCT_ID: "ProdId",
    PACK_ID: "Packid",
    RATE: "Rate",
    MRP: "Mrp",
    DISCOUNT: "Dis",
    ACTIVE: "Active"
  }
};

const PACK_UNIT_MASTER = {
  NAME: "PackUnitMaster",
  COLUMNS: {
    PACK_ID: "Packid",
    PACK_NAME: "PackName",
    WEIGHT: "Wt",
    ACTIVE: "Active"
  }
};

const MAIN_CATEGORY = {
  NAME: "MainCategory",
  COLUMNS: {
    MCAT_ID: "Mcatid",
    MCAT_NAME: "MCatName",
    ACTIVE: "Active",
    IMG_PATH: "ImgPath",
    M_IM_GPATH: "mImgPath",
    STOCK_CHECK: "StockCheck",
    MENU_POS: "menuPos",
    CAT_ID: "catid"
  }
};

module.exports = {
  PRODUCT,
  PACK_UNIT_MASTER,
  PRODUCT_PACK,
  MAIN_CATEGORY
};
