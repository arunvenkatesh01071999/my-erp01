const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ITEM, BARCODE_LIST } = require("../../../catalog/commons");
const { TYPEDESIGN } = require("../../../catalog/commons");
const { HEADS } = require("../../../catalog/commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");

const {
  MAIN_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");

function itemRepo(fastify) {
  async function getItemPaginate({ params, logTrace }) {
    const knex = this;
    // const query = knex(ITEM.NAME);
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
      );

    // Conditionally add filters based on provided parameters
    if (params.head && params.head !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`, params.head);
    }

    if (params.type && params.type !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`, params.type);
    }

    if (params.category && params.category !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.CATID}`, params.category);
    }

    if (params.subcategory && params.subcategory !== 0) {
      query.where(
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        params.subcategory
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item ",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item not found",
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
  async function getStockValue({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        knex.raw(`COALESCE(a.${BARCODE_LIST.COLUMNS.OUTLET_ID}, 0) as outlet_id`),
        knex.raw(`COALESCE(g.${OUTLETS.COLUMNS.SHORTNAME}, 'Warehouse') as outlet`),
        knex.raw(
          `COUNT(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = true AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN 1 END) as sold_count`
        ),
        // knex.raw(
        //   `COUNT(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN 1 END) as qty`
        // ),
        // knex.raw(`
        //   COUNT(
        //     CASE 
        //       WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false 
        //            AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 
        //            AND (a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL 
        //                 OR a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NULL) 
        //       THEN 1 
        //     END
        //   ) as qty
        // `),
        knex.raw(`
          COUNT(
            CASE 
              WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false 
                   AND (
                     (a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 
                      AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL)
                     OR
                     (a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 0 
                      AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NULL)
                   ) 
              THEN 1 
            END
          ) as qty
        `),
        knex.raw(
          `(COUNT(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = true AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN 1 END) 
            + COUNT(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN 1 END)) as total`
        ),
        knex.raw(
          `COUNT(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NULL AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 0 THEN 1 END) as inwarehouse_count`
        ),
        knex.raw(
          `SUM(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN b.${ITEM.COLUMNS.MRP} ELSE 0 END) as outlet_mrp_sum`
        ),
        knex.raw(
          `SUM(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN b.${ITEM.COLUMNS.PARCHASE_RATE} ELSE 0 END) as outlet_pur_rate_sum`
        ),
        knex.raw(
          `SUM(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 0 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NULL THEN b.${ITEM.COLUMNS.MRP} ELSE 0 END) as warehouse_mrp_sum`
        ),
        knex.raw(
          `SUM(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 0 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NULL THEN b.${ITEM.COLUMNS.PARCHASE_RATE} ELSE 0 END) as warehouse_pur_rate_sum`
        ),
        knex.raw(
          `SUM(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 1 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NOT NULL THEN b.${ITEM.COLUMNS.PARCHASE_RATE} * b.${ITEM.COLUMNS.GST} / 100 ELSE 0 END) as outlet_tax_value`
        ),
        knex.raw(
          `SUM(CASE WHEN a.${BARCODE_LIST.COLUMNS.IS_SOLD} = false AND a.${BARCODE_LIST.COLUMNS.IS_VERIFIED} = 0 AND a.${BARCODE_LIST.COLUMNS.OUTLET_ID} IS NULL THEN b.${ITEM.COLUMNS.PARCHASE_RATE} * b.${ITEM.COLUMNS.GST} / 100 ELSE 0 END) as warehouse_tax_value`
        )
      ])
      .from(`${BARCODE_LIST.NAME} as a`)
      .leftJoin(`${ITEM.NAME} as b`, `b.${ITEM.COLUMNS.ID}`, `a.${BARCODE_LIST.COLUMNS.PROD_ID}`)
      .leftJoin(`${MAIN_CATEGORY.NAME} as f`, `f.${MAIN_CATEGORY.COLUMNS.ID}`, `b.${ITEM.COLUMNS.CATID}`)
      .leftJoin(`${OUTLETS.NAME} as g`, `g.${OUTLETS.COLUMNS.ID}`, `a.${BARCODE_LIST.COLUMNS.OUTLET_ID}`)
      .groupBy([
        `g.${OUTLETS.COLUMNS.SHORTNAME}`,
        `a.${BARCODE_LIST.COLUMNS.OUTLET_ID}`
      ])
      .orderBy(`a.${BARCODE_LIST.COLUMNS.OUTLET_ID}`);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Stock Value",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  return {
    getItemPaginate,
    getStockValue
  };
}

module.exports = itemRepo;
