const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { OUTLET_EXPENCE_LEDGER, OUTLET_EXPENSES, OUTLET_EXPENSES_DETAILS, SUB_ACCOUNT_MASTER } = require("../commons/constants");
const { HEADS, ACCOUNTMASTER } = require("../../catalog/commons");
const { OUTLETS } = require("../../accounts/outlets/commons/constants");


function expenceRepo(fastify) {

  async function deleteOutletExpencesWithOutletExpencesDetails({ params, body, logTrace, userDetails }) {
    const knex = this;

    const outlet_expences_id = body.outlet_expences_id
    const outlet_id = body.outlet_id
    const acc_id = body.acc_id
    const edate = body.edate
    const total_amount = body.total_amount

    // console.log(outlet_expences_id, "outlet_expences_id");

    if (outlet_expences_id) {

      const delete_outlet_expences = await knex(OUTLET_EXPENSES.NAME)
        .where(OUTLET_EXPENSES.COLUMNS.ID, outlet_expences_id)
        .where(OUTLET_EXPENSES.COLUMNS.OUTLET_ID, outlet_id)
        .delete();

      const delete_outlet_expences_details = await knex(OUTLET_EXPENSES_DETAILS.NAME)
        .where(OUTLET_EXPENSES_DETAILS.COLUMNS.OUTLET_EXPENCES_ID, outlet_expences_id)
        // .where(OUTLET_EXPENSES_DETAILS.COLUMNS.OUTLET_ID, outlet_id)
        .delete();

      const update_outlet_expences_ledger = await knex(OUTLET_EXPENCE_LEDGER.NAME)
        .where({
          [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: acc_id,
          [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: outlet_id,
          [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: edate
        })
        .update({
          [OUTLET_EXPENCE_LEDGER.COLUMNS.AMOUNT]: knex.raw(
            `${OUTLET_EXPENCE_LEDGER.COLUMNS.AMOUNT} - ${total_amount}`
          ),
        });

    }

    return { success: true };

  }
  async function postOutletExpencesWithOutletExpencesDetails({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    for (let i = 0; i < body.length; i++) {
      var entry = body[i];

      var expencesMaster_Data = {
        docdate: entry.docdate,
        accid: entry.accid,
        amount: entry.amount,
        remarks: entry.remarks,
        company_id: entry.company_id,
        outletid: entry.outletid

      }

      console.log(expencesMaster_Data, "expencesMaster_Data");

      const outlet_limitation = await knex(OUTLETS.NAME)
        .select(
          OUTLETS.COLUMNS.LIMITATION,
          OUTLETS.COLUMNS.SHORTNAME,
        )
        .where({
          [OUTLETS.COLUMNS.ID]: expencesMaster_Data.outletid,
        })

      const limitation = outlet_limitation[0].limitation
      const outlet_short_name = outlet_limitation[0].short_name

      let limit = parseInt(limitation.replace('.00', ''), 10);

      // console.log(limit, "limitation");

      const date = expencesMaster_Data.docdate;
      const outletid = expencesMaster_Data.outletid

      const outlet_expenses_amount = await knex.raw(`select sum(amount) from outlet_expenses where 
    EXTRACT(month FROM docdate) = EXTRACT(month FROM Date('${date}'))
    AND outletid = '${outletid}'`)

      const amount_of_month = outlet_expenses_amount.rows[0].sum;

      // console.log(amount_of_month, "amount_of_month");


      if (amount_of_month < limit) {

        const query_insert = knex(OUTLET_EXPENSES.NAME)
          .returning("id")
          .insert({
            [OUTLET_EXPENSES.COLUMNS.DOCDATE]: expencesMaster_Data.docdate,
            [OUTLET_EXPENSES.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
            [OUTLET_EXPENSES.COLUMNS.AMOUNT]: expencesMaster_Data.amount,
            [OUTLET_EXPENSES.COLUMNS.REMARKS]: expencesMaster_Data.remarks,
            [OUTLET_EXPENSES.COLUMNS.OUTLET_ID]: expencesMaster_Data.outletid,
            [OUTLET_EXPENSES.COLUMNS.COMPANY_ID]: expencesMaster_Data.company_id,
            [OUTLET_EXPENSES.COLUMNS.CREATED_BY]: 2
          });

        const response = await query_insert;
        const id = response[0].id;
        const idres = await knex(OUTLET_EXPENSES.NAME)
          .count('id as count')
          .where(OUTLET_EXPENSES.COLUMNS.OUTLET_ID, expencesMaster_Data.outletid);
        // const id = idres[0].count;
        const id1 = Number(idres[0].count);

        const docno = `${outlet_short_name}_${financialYear}_OEX_${id1}`
        // const docno = "OEX" + id;

        // Update OUTLET_EXPENSES with the generated DOCNO
        await knex(OUTLET_EXPENSES.NAME)
          .where(OUTLET_EXPENSES.COLUMNS.ID, id)
          .update({
            [OUTLET_EXPENSES.COLUMNS.DOCNO]: docno
          });

        // **************** expences details *****************

        for (let j = 0; j < entry.outlet_expences_details.length; j++) {
          var detail = entry.outlet_expences_details[j];

          var expencesDetails_Data = {
            id: id,
            docdate: detail.docdate,
            accid: detail.accid,
            sub_acc_id: detail.sub_acc_id,
            amount: detail.amount,
          }

          const query_insert2 = await knex(`${OUTLET_EXPENSES_DETAILS.NAME}`).insert
            ({
              [OUTLET_EXPENSES_DETAILS.COLUMNS.OUTLET_EXPENCES_ID]: expencesDetails_Data.id,
              [OUTLET_EXPENSES_DETAILS.COLUMNS.DOCDATE]: expencesDetails_Data.docdate,
              [OUTLET_EXPENSES_DETAILS.COLUMNS.ACC_ID]: expencesDetails_Data.accid,
              [OUTLET_EXPENSES_DETAILS.COLUMNS.SUB_ACC_ID]: expencesDetails_Data.sub_acc_id,
              [OUTLET_EXPENSES_DETAILS.COLUMNS.AMOUNT]: expencesDetails_Data.amount,
              [OUTLET_EXPENSES_DETAILS.COLUMNS.CREATED_BY]: 2,
            });

        }

        const existingdata = await knex(OUTLET_EXPENSES.NAME)
          .select(
            OUTLET_EXPENSES.COLUMNS.DOCDATE,
            OUTLET_EXPENSES.COLUMNS.ACC_ID,
            knex.raw('SUM(' + OUTLET_EXPENSES.COLUMNS.AMOUNT + ') as totalAmount')
          )
          .where({
            [OUTLET_EXPENSES.COLUMNS.DOCDATE]: expencesMaster_Data.docdate,
            [OUTLET_EXPENSES.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
            [OUTLET_EXPENSES.COLUMNS.OUTLET_ID]: expencesMaster_Data.outletid,
          })
          .groupBy(
            OUTLET_EXPENSES.COLUMNS.DOCDATE,
            OUTLET_EXPENSES.COLUMNS.ACC_ID
          );

        const totalAmount = existingdata[0].totalamount


        const existingRecord = await knex(OUTLET_EXPENCE_LEDGER.NAME)
          .where({
            [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: expencesMaster_Data.docdate,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: expencesMaster_Data.outletid,
          })
          .first();

        if (existingRecord) {
          await knex(OUTLET_EXPENCE_LEDGER.NAME)
            .where({
              [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: expencesMaster_Data.docdate,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: expencesMaster_Data.outletid,
            })
            .update({
              [OUTLET_EXPENCE_LEDGER.COLUMNS.AMOUNT]: totalAmount,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: expencesMaster_Data.company_id,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2
            });
        } else {
          await knex(OUTLET_EXPENCE_LEDGER.NAME)
            .insert({
              [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: expencesMaster_Data.docdate,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.AMOUNT]: expencesMaster_Data.amount,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: expencesMaster_Data.company_id,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2,
              [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: expencesMaster_Data.outletid,
            });
        }
      }
      else {

        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Monthly Expenses Limit Is Reached",
          property: "",
          code: "NOT_ACCEPTABLE"
        });

      }

    }

    return { success: true };
  }
  async function postOutletExpences({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    const outlet_limitation = await knex(OUTLETS.NAME)
      .select(
        OUTLETS.COLUMNS.LIMITATION,
        OUTLETS.COLUMNS.SHORTNAME,
      )
      .where({
        [OUTLETS.COLUMNS.ID]: body.outletid,
      })

    const limitation = outlet_limitation[0].limitation
    const outlet_short_name = outlet_limitation[0].short_name

    let limit = parseInt(limitation.replace('.00', ''), 10);

    // console.log(limit, "limitation");

    const date = body.docdate;
    const outletid = body.outletid

    const outlet_expenses_amount = await knex.raw(`select sum(amount) from outlet_expenses where 
    EXTRACT(month FROM docdate) = EXTRACT(month FROM Date('${date}'))
    AND outletid = '${outletid}'`)

    const amount_of_month = outlet_expenses_amount.rows[0].sum;

    // console.log(amount_of_month, "amount_of_month");


    if (amount_of_month < limit) {

      const query_insert = knex(OUTLET_EXPENSES.NAME)
        .returning("id")
        .insert({
          [OUTLET_EXPENSES.COLUMNS.DOCDATE]: body.docdate,
          [OUTLET_EXPENSES.COLUMNS.ACC_ID]: body.accid,
          [OUTLET_EXPENSES.COLUMNS.AMOUNT]: body.amount,
          [OUTLET_EXPENSES.COLUMNS.REMARKS]: body.remarks,
          [OUTLET_EXPENSES.COLUMNS.OUTLET_ID]: body.outletid,
          [OUTLET_EXPENSES.COLUMNS.COMPANY_ID]: body.company_id,
          [OUTLET_EXPENSES.COLUMNS.CREATED_BY]: 2
        });

      const response = await query_insert;
      // const id = response[0].id;
      const idres = await knex(OUTLET_EXPENSES.NAME)
        .count('id as count')
        .where(OUTLET_EXPENSES.COLUMNS.OUTLET_ID, body.outletid);
      const id = Number(idres[0].count);

      const docno = `${outlet_short_name}_${financialYear}_OEX_${id}`
      // const docno = "OEX" + id;

      // Update OUTLET_EXPENSES with the generated DOCNO
      await knex(OUTLET_EXPENSES.NAME)
        .where(OUTLET_EXPENSES.COLUMNS.ID, id)
        .update({
          [OUTLET_EXPENSES.COLUMNS.DOCNO]: docno
        });

      const existingdata = await knex(OUTLET_EXPENSES.NAME)
        .select(
          OUTLET_EXPENSES.COLUMNS.DOCDATE,
          OUTLET_EXPENSES.COLUMNS.ACC_ID,
          knex.raw('SUM(' + OUTLET_EXPENSES.COLUMNS.AMOUNT + ') as totalAmount')
        )
        .where({
          [OUTLET_EXPENSES.COLUMNS.DOCDATE]: body.docdate,
          [OUTLET_EXPENSES.COLUMNS.ACC_ID]: body.accid,
          [OUTLET_EXPENSES.COLUMNS.OUTLET_ID]: body.outletid,
        })
        .groupBy(
          OUTLET_EXPENSES.COLUMNS.DOCDATE,
          OUTLET_EXPENSES.COLUMNS.ACC_ID
        );

      const totalAmount = existingdata[0].totalamount


      const existingRecord = await knex(OUTLET_EXPENCE_LEDGER.NAME)
        .where({
          [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: body.docdate,
          [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: body.accid,
          [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: body.outletid,
        })
        .first();

      if (existingRecord) {
        await knex(OUTLET_EXPENCE_LEDGER.NAME)
          .where({
            [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: body.docdate,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: body.accid,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: body.outletid,
          })
          .update({
            [OUTLET_EXPENCE_LEDGER.COLUMNS.AMOUNT]: totalAmount,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2
          });
      } else {
        await knex(OUTLET_EXPENCE_LEDGER.NAME)
          .insert({
            [OUTLET_EXPENCE_LEDGER.COLUMNS.EDATE]: body.docdate,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.ACC_ID]: body.accid,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.AMOUNT]: body.amount,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2,
            [OUTLET_EXPENCE_LEDGER.COLUMNS.OUTLET_ID]: body.outletid,
          });
      }
    }
    else {

      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Monthly Expenses Limit Is Reached",
        property: "",
        code: "NOT_ACCEPTABLE"
      });

    }
    return { success: true };
  }
  async function getOutletExpenceDocno({ params, logTrace, financialYear }) {
    const knex = this;
    let query;
    let outlet_short_name = 'OE';
    if (params.outlet_id) {

      const short_name = await knex(OUTLETS.NAME)
        .where(OUTLETS.COLUMNS.ID, params.outlet_id)
        .select(OUTLETS.COLUMNS.SHORTNAME);

      outlet_short_name = short_name[0].short_name

      query = knex(OUTLET_EXPENSES.NAME)
        .count('id as count')
        .where(OUTLET_EXPENSES.COLUMNS.OUTLET_ID, params.outlet_id);

    } else {

      query = knex(OUTLET_EXPENSES.NAME)
        .count('id as count');

      logQuery({
        logger: fastify.log,
        query,
        context: "Get  Expense Docno",
        logTrace
      });
    }
    const response = await query;
    const count = response[0].count;

    if (response.length === 0) {

      let doc_first = `${outlet_short_name}_${financialYear}_OEX_1`
      return { Docno: doc_first };
    }


    const docno = Number(response[0].count);

    const numericPart = docno;

    if (isNaN(numericPart)) {
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Invalid docno format in response",
        property: "",
        code: "INVALID_DOCNO_FORMAT"
      });
    }

    const Docno = `${outlet_short_name}_${financialYear}_OEX_${numericPart + 1}`;

    return { Docno };
  }

  async function getAllOutletExpence({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLET_EXPENSES.NAME}.*`,
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCDATE}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.COMPANY_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,
      ])
      .from(OUTLET_EXPENSES.NAME)
      .leftJoin(HEADS.NAME, `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)
      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)
      .whereBetween(`${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCDATE}`, [params.from_date, params.to_date]);
    if (params.outlet_id && params.outlet_id !== 0) {
      query.where(
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.OUTLET_ID}`,
        params.outlet_id
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Expences",
      logTrace
    });
    const response = await query;

    return response

  }

  async function updateOutletExpences({ id, params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OUTLET_EXPENSES.NAME).where(OUTLET_EXPENSES.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "expencesid not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const outlet_limitation = await knex(OUTLETS.NAME)
      .select(
        OUTLETS.COLUMNS.LIMITATION,
      )
      .where({
        [OUTLETS.COLUMNS.ID]: body.outletid,
      })

    const limitation = outlet_limitation[0].limitation

    let limit = parseInt(limitation.replace('.00', ''), 10);

    // console.log(limit, "limitation");

    const date = body.docdate;
    const outletid = body.outletid
    const outlet_expenses_amount = await knex.raw(`select sum(amount) from outlet_expenses where 
  EXTRACT(month FROM docdate) = EXTRACT(month FROM Date('${date}'))
  AND outletid = '${outletid}'`)

    const amount_of_month = outlet_expenses_amount.rows[0].sum;


    if (amount_of_month < limit) {


      const query_update = await knex(`${OUTLET_EXPENSES.NAME}`)
        .where(`${OUTLET_EXPENSES.COLUMNS.ID}`, id)
        .update({
          [OUTLET_EXPENSES.COLUMNS.DOCDATE]: body.docdate,
          [OUTLET_EXPENSES.COLUMNS.ACC_ID]: body.accid,
          [OUTLET_EXPENSES.COLUMNS.AMOUNT]: body.amount,
          [OUTLET_EXPENSES.COLUMNS.REMARKS]: body.remarks,
          [OUTLET_EXPENSES.COLUMNS.COMPANY_ID]: body.company_id,
          [OUTLET_EXPENSES.COLUMNS.UPDATED_BY]: userDetails.id

        });

      const response = await query_update;
      if (!response) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while updating OUTLET EXPENSES",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }
    }
    else {

      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Monthly Expenses Limit Is Reached",
        property: "",
        code: "NOT_ACCEPTABLE"
      });

    }


    return { success: true };
  }


  async function getAllOutletExpenceWithOutletExpencesDetails({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLET_EXPENSES.NAME}.*`,
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCDATE}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.COMPANY_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,
      ])
      .from(OUTLET_EXPENSES.NAME)
      .leftJoin(HEADS.NAME, `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)

      .whereBetween(`${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.DOCDATE}`, [body.from_date, body.to_date]);

    if (body.outlet_id && body.outlet_id !== 0) {
      query.where(
        `${OUTLET_EXPENSES.NAME}.${OUTLET_EXPENSES.COLUMNS.OUTLET_ID}`,
        body.outlet_id
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Expences",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Expences Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const expences_details = await Promise.all(
      response.map(async expences => {
        const outlet_expences_lines = await knex
          .select([
            `${OUTLET_EXPENSES_DETAILS.NAME}.*`,
            `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.SUB_ACC_NAME}`,
            // `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.PRODUCT_CODE}`,
            // `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            // `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            // `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${OUTLET_EXPENSES_DETAILS.NAME} as ${OUTLET_EXPENSES_DETAILS.NAME}`)
          .leftJoin(
            `${SUB_ACCOUNT_MASTER.NAME} as ${SUB_ACCOUNT_MASTER.NAME}`,
            `${OUTLET_EXPENSES_DETAILS.NAME}.${OUTLET_EXPENSES_DETAILS.COLUMNS.SUB_ACC_ID}`,
            `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.ID}`
          )

          .where(
            `${OUTLET_EXPENSES_DETAILS.NAME}.${OUTLET_EXPENSES_DETAILS.COLUMNS.OUTLET_EXPENCES_ID}`,
            expences.id
          );

        return { ...expences, outlet_expences_lines };
      })
    );

    return expences_details

  }
  return {
    postOutletExpencesWithOutletExpencesDetails,
    postOutletExpences,
    getOutletExpenceDocno,
    getAllOutletExpence,
    updateOutletExpences,
    getAllOutletExpenceWithOutletExpencesDetails,
    deleteOutletExpencesWithOutletExpencesDetails
  };
}


module.exports = expenceRepo;
