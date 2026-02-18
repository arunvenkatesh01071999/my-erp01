const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { COMPANY_MASTERM } = require("../commons/constants")
const { COMPANY } = require("../../company/commons/constants")
const { WAREHOUSE } = require("../../../catalog/warehouse/commons/constants")
const { OUTLETS } = require("../../../accounts/outlets/commons/constants")



function getBillNoSequenceRepo(fastify) {
  async function postBillNoSequence({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;

    const existing = await knex(COMPANY_MASTERM.NAME)
      .where({
        [COMPANY_MASTERM.COLUMNS.COMPANY_ID]: body.company_id,
        [COMPANY_MASTERM.COLUMNS.WH_ID]: body.wh_id,
        [COMPANY_MASTERM.COLUMNS.OUTLET_ID]: body.outlet_id
      })
      .first();

    if (existing) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Bill No Sequence already exists for this Company, WH and Outlet",
        code: "DUPLICATE_ENTRY"
      });
    }

    await knex(COMPANY_MASTERM.NAME).insert({
      [COMPANY_MASTERM.COLUMNS.COMPANY_ID]: body.company_id,
      [COMPANY_MASTERM.COLUMNS.WH_ID]: body.wh_id,
      [COMPANY_MASTERM.COLUMNS.OUTLET_ID]: body.outlet_id,
      [COMPANY_MASTERM.COLUMNS.COUNTER]: body.counter,
      [COMPANY_MASTERM.COLUMNS.BILL_SEQUENCE]: body.bill_sequence,
      [COMPANY_MASTERM.COLUMNS.BILL_NO_TYPE]: body.bill_no_type,
      [COMPANY_MASTERM.COLUMNS.CREATED_BY]: created_by,
      [COMPANY_MASTERM.COLUMNS.CREATED_AT]: new Date()
    });

    return { success: true };
  }

  async function putBillNoSequence({ params, body, logTrace, userDetails }) {
    const knex = this;
    const updated_by = userDetails.id;
    const { company_id, wh_id, outlet_id, counter } = params;
    const { bill_sequence, bill_no_type } = body;

    const exists_response = await knex(COMPANY_MASTERM.NAME)
      .where(COMPANY_MASTERM.COLUMNS.COMPANY_ID, company_id)
      .andWhere(COMPANY_MASTERM.COLUMNS.WH_ID, wh_id)
      .andWhere(COMPANY_MASTERM.COLUMNS.OUTLET_ID, outlet_id)
      .andWhere(COMPANY_MASTERM.COLUMNS.COUNTER, counter)
      .first();

    if (!exists_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "BillNoSequence not found to update",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const update_response = await knex(COMPANY_MASTERM.NAME)
      .where(COMPANY_MASTERM.COLUMNS.COMPANY_ID, company_id)
      .andWhere(COMPANY_MASTERM.COLUMNS.WH_ID, wh_id)
      .andWhere(COMPANY_MASTERM.COLUMNS.OUTLET_ID, outlet_id)
      .andWhere(COMPANY_MASTERM.COLUMNS.COUNTER, counter)
      .update({
        [COMPANY_MASTERM.COLUMNS.BILL_NO_TYPE]: bill_no_type,
        [COMPANY_MASTERM.COLUMNS.BILL_SEQUENCE]: bill_sequence,
        [COMPANY_MASTERM.COLUMNS.UPDATED_BY]: updated_by,
        [COMPANY_MASTERM.COLUMNS.UPDATED_AT]: new Date()
      });

    if (!update_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating BillNoSequence",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deleteBillNoSequence({ id, body, logTrace, userDetails }) {
    const knex = this;

    const existingBillNoSequence = await knex(COMPANY_MASTERM.NAME)
      .where(COMPANY_MASTERM.COLUMNS.ID, id)
      .first();

    if (!existingBillNoSequence) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Bill No Sequence not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }

    await knex(COMPANY_MASTERM.NAME)
      .where(COMPANY_MASTERM.COLUMNS.ID, id)
      .del();

    return { success: true };
  }

  async function getBillNoSequence({ body, params, logTrace }) {
    const knex = this;
    const { company_id, wh_id, outlet_id, counter } = params
    const query = knex
      .select(
        `${COMPANY_MASTERM.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`
      )
      .from(`${COMPANY_MASTERM.NAME} as ${COMPANY_MASTERM.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${COMPANY_MASTERM.NAME}.${COMPANY_MASTERM.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where(
        `${COMPANY_MASTERM.NAME}.${COMPANY_MASTERM.COLUMNS.COMPANY_ID}`,
        company_id
      )
      .andWhere(
        `${COMPANY_MASTERM.NAME}.${COMPANY_MASTERM.COLUMNS.WH_ID}`,
        wh_id
      )
      .andWhere(
        `${COMPANY_MASTERM.NAME}.${COMPANY_MASTERM.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
      .andWhere(
        `${COMPANY_MASTERM.NAME}.${COMPANY_MASTERM.COLUMNS.COUNTER}`,
        counter
      )
      .first();

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Clearance Sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  return {
    postBillNoSequence,
    putBillNoSequence,
    deleteBillNoSequence,
    getBillNoSequence
  };
}

module.exports = getBillNoSequenceRepo;
