const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLET_TO_OUTLET_TRANSFER_MASTER,
  OUTLET_TO_OUTLET_TRANSFER_DETAILS,
  BARCODE_LIST,
  OUTLET_PRODUCT_MAPPING } = require("../../../../../src/app/outlet_to_outlet_transfer/outlet_to_outlet_transfer_master/commons/constants");

const {
  MAIN_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { ITEM } = require("../../../catalog/commons");
const { HEADS } = require("../../../catalog/commons");
const { TYPEDESIGN } = require("../../../catalog/commons");

function outletToOutletTransferReportRepo(fastify) {
  async function outletToOutletTransferReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.*`,
        `from_outlet.${OUTLETS.COLUMNS.FULLNAME} as from_outlet_fullname`,
        `from_outlet.${OUTLETS.COLUMNS.SHORTNAME} as from_outlet_shortname`,
        `from_outlet.${OUTLETS.COLUMNS.CODE} as from_outlet_code`,
        `to_outlet.${OUTLETS.COLUMNS.FULLNAME} as to_outlet_fullname`,
        `to_outlet.${OUTLETS.COLUMNS.SHORTNAME} as to_outlet_shortname`,
        `to_outlet.${OUTLETS.COLUMNS.CODE} as to_outlet_code`,
        `outlet.${OUTLETS.COLUMNS.FULLNAME}`,
        `outlet.${OUTLETS.COLUMNS.SHORTNAME}`,
        `outlet.${OUTLETS.COLUMNS.CODE}`,
        `outlet.${OUTLETS.COLUMNS.ADD1}`,
        `outlet.${OUTLETS.COLUMNS.ADD2}`,
        `outlet.${OUTLETS.COLUMNS.ADD4}`,
        `outlet.${OUTLETS.COLUMNS.CITY}`,
        `outlet.${OUTLETS.COLUMNS.PINCODE}`,
        `outlet.${OUTLETS.COLUMNS.STATE}`,
        `outlet.${OUTLETS.COLUMNS.COUNTRY}`,
        `outlet.${OUTLETS.COLUMNS.PHONE}`,
        `outlet.${OUTLETS.COLUMNS.MOBILE}`,
        `outlet.${OUTLETS.COLUMNS.EMAIL}`,
        `outlet.${OUTLETS.COLUMNS.WEBSITE}`,
        `outlet.${OUTLETS.COLUMNS.GSTIN}`,
        `outlet.${OUTLETS.COLUMNS.FSSAI}`,
        `outlet.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `outlet.${OUTLETS.COLUMNS.BANKACNO}`,
        `outlet.${OUTLETS.COLUMNS.BANKNAME}`,
        `outlet.${OUTLETS.COLUMNS.ACNAME}`,
        `outlet.${OUTLETS.COLUMNS.IFSCCODE}`,
        `outlet.${OUTLETS.COLUMNS.ISGST}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME} as ${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as from_outlet`,
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.FROM_OUTLET_ID}`,
        `from_outlet.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as to_outlet`,
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.TO_OUTLET_ID}`,
        `to_outlet.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as outlet`,
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.OUTLETID}`,
        `outlet.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `outlet.${OUTLETS.COLUMNS.STATE}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `outlet.${OUTLETS.COLUMNS.CITY}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `outlet.${OUTLETS.COLUMNS.COUNTRY}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
        `outlet.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.ID}`, "DESC");


    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }
    if (body.is_approved && body.is_approved !== 0) {
      query.where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED}`,
        body.is_approved
      );
    }
    // console.log(fillter, "fillter");


    if (parseInt(body.fillter) && parseInt(body.fillter) == 1) {
      query.where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_OWNED}`,
        true
      );
    } if (parseInt(body.fillter) && parseInt(body.fillter) == 2) {
      query.where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED}`,
        true
      )
        .andWhere(
          `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_OWNED}`,
          false
        )
    }
    if (parseInt(body.fillter) && parseInt(body.fillter) == 3) {

      query.where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_OWNED}`,
        false
      )
        .andWhere(
          `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED}`,
          false
        )
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Transfer Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Get Outlet Transfer Master not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const outletToOutletTransferDetails = await Promise.all(
      response.map(async outletToOutletTransfer => {
        const outlet_to_outlet_transfer_lines = await knex
          .select([
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME} as ${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.OUTLET_TO_OUTLET_TRANSFER_MASTER_ID}`,
            outletToOutletTransfer.id
          );

        return { ...outletToOutletTransfer, outlet_to_outlet_transfer_lines };
      })
    );

    return outletToOutletTransferDetails;
  }

  async function outletToOutletTransferUnOwnedReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.*`,
        `from_outlet.${OUTLETS.COLUMNS.FULLNAME} as from_outlet_fullname`,
        `from_outlet.${OUTLETS.COLUMNS.SHORTNAME} as from_outlet_shortname`,
        `from_outlet.${OUTLETS.COLUMNS.CODE} as from_outlet_code`,
        `to_outlet.${OUTLETS.COLUMNS.FULLNAME} as to_outlet_fullname`,
        `to_outlet.${OUTLETS.COLUMNS.SHORTNAME} as to_outlet_shortname`,
        `to_outlet.${OUTLETS.COLUMNS.CODE} as to_outlet_code`,
        `outlet.${OUTLETS.COLUMNS.FULLNAME}`,
        `outlet.${OUTLETS.COLUMNS.SHORTNAME}`,
        `outlet.${OUTLETS.COLUMNS.CODE}`,
        `outlet.${OUTLETS.COLUMNS.ADD1}`,
        `outlet.${OUTLETS.COLUMNS.ADD2}`,
        `outlet.${OUTLETS.COLUMNS.ADD4}`,
        `outlet.${OUTLETS.COLUMNS.CITY}`,
        `outlet.${OUTLETS.COLUMNS.PINCODE}`,
        `outlet.${OUTLETS.COLUMNS.STATE}`,
        `outlet.${OUTLETS.COLUMNS.COUNTRY}`,
        `outlet.${OUTLETS.COLUMNS.PHONE}`,
        `outlet.${OUTLETS.COLUMNS.MOBILE}`,
        `outlet.${OUTLETS.COLUMNS.EMAIL}`,
        `outlet.${OUTLETS.COLUMNS.WEBSITE}`,
        `outlet.${OUTLETS.COLUMNS.GSTIN}`,
        `outlet.${OUTLETS.COLUMNS.FSSAI}`,
        `outlet.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `outlet.${OUTLETS.COLUMNS.BANKACNO}`,
        `outlet.${OUTLETS.COLUMNS.BANKNAME}`,
        `outlet.${OUTLETS.COLUMNS.ACNAME}`,
        `outlet.${OUTLETS.COLUMNS.IFSCCODE}`,
        `outlet.${OUTLETS.COLUMNS.ISGST}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME} as ${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as from_outlet`,
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.FROM_OUTLET_ID}`,
        `from_outlet.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as to_outlet`,
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.TO_OUTLET_ID}`,
        `to_outlet.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as outlet`,
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.OUTLETID}`,
        `outlet.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `outlet.${OUTLETS.COLUMNS.STATE}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `outlet.${OUTLETS.COLUMNS.CITY}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `outlet.${OUTLETS.COLUMNS.COUNTRY}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
        `outlet.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_OWNED}`,
        false
      )
      .where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED}`,
        false
      )
      .orderBy(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.ID}`, "DESC");
    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}.${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Transfer Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Get Outlet Transfer Master not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const outletToOutletTransferDetails = await Promise.all(
      response.map(async outletToOutletTransfer => {
        const outlet_to_outlet_transfer_lines = await knex
          .select([
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME} as ${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}.${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.OUTLET_TO_OUTLET_TRANSFER_MASTER_ID}`,
            outletToOutletTransfer.id
          );

        return { ...outletToOutletTransfer, outlet_to_outlet_transfer_lines };
      })
    );

    return outletToOutletTransferDetails;
  }

  return {
    outletToOutletTransferReport,
    outletToOutletTransferUnOwnedReport
  };
}

module.exports = outletToOutletTransferReportRepo;
