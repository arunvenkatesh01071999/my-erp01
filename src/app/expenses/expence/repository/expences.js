const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { EXPENSES, EXPENCE_LEDGER, EXPENSES_DETAILS, SUB_ACCOUNT_MASTER } = require("../commons/constants");
const { HEADS, ACCOUNTMASTER, WAREHOUSE } = require("../../../catalog/commons");


function expenceRepo(fastify) {


  async function postExpencesWithExpencesDetails({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    for (let i = 0; i < body.length; i++) {
      var entry = body[i];

      var expencesMaster_Data = {
        docdate: entry.docdate,
        accid: entry.accid,
        amount: entry.amount,
        remarks: entry.remarks,
        company_id: entry.company_id,
        warehouse_id: entry.warehouse_id

      }

      console.log(expencesMaster_Data, "expencesMaster_Data");

      const outlet_limitation = await knex(WAREHOUSE.NAME)
        .select(
          WAREHOUSE.COLUMNS.LIMITATION,
          WAREHOUSE.COLUMNS.SHORT_NAME
        )
        .where({
          [WAREHOUSE.COLUMNS.ID]: expencesMaster_Data.warehouse_id,
        })

      const limitation = outlet_limitation[0].limitation
      const outlet_short_name = outlet_limitation[0].short_name

      let limit = parseInt(limitation.replace('.00', ''), 10);

      // console.log(limit, "limitation");

      const date = expencesMaster_Data.docdate;
      const warehouse_id = expencesMaster_Data.warehouse_id

      const outlet_expenses_amount = await knex.raw(`select sum(amount) from expenses where 
    EXTRACT(month FROM docdate) = EXTRACT(month FROM Date('${date}'))
    AND warehouse_id = '${warehouse_id}'`)

      const amount_of_month = outlet_expenses_amount.rows[0].sum;

      // console.log(amount_of_month, "amount_of_month");


      if (amount_of_month < limit) {

        const query_insert = knex(EXPENSES.NAME)
          .returning("id")
          .insert({
            [EXPENSES.COLUMNS.DOCDATE]: expencesMaster_Data.docdate,
            [EXPENSES.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
            [EXPENSES.COLUMNS.AMOUNT]: expencesMaster_Data.amount,
            [EXPENSES.COLUMNS.REMARKS]: expencesMaster_Data.remarks,
            [EXPENSES.COLUMNS.WAREHOUSE_ID]: expencesMaster_Data.warehouse_id,
            [EXPENSES.COLUMNS.COMPANY_ID]: expencesMaster_Data.company_id,
            [EXPENSES.COLUMNS.CREATED_BY]: 2
          });

        const response = await query_insert;
        const id = response[0].id;
        const idres = await knex(EXPENSES.NAME)
          .count('id as count')
          .where(EXPENSES.COLUMNS.WAREHOUSE_ID, expencesMaster_Data.warehouse_id);
        // const id = idres[0].count;
        const id1 = Number(idres[0].count);

        const docno = `${outlet_short_name}${financialYear}_WEX_${id1}`
        // const docno = "OEX" + id;

        // Update OUTLET_EXPENSES with the generated DOCNO
        await knex(EXPENSES.NAME)
          .where(EXPENSES.COLUMNS.ID, id)
          .update({
            [EXPENSES.COLUMNS.DOCNO]: docno
          });

        // **************** expences details *****************

        for (let j = 0; j < entry.expences_details.length; j++) {
          var detail = entry.expences_details[j];

          var expencesDetails_Data = {
            id: id,
            docdate: detail.docdate,
            accid: detail.accid,
            sub_acc_id: detail.sub_acc_id,
            amount: detail.amount,
          }

          const query_insert2 = await knex(`${EXPENSES_DETAILS.NAME}`).insert
            ({
              [EXPENSES_DETAILS.COLUMNS.EXPENCES_ID]: expencesDetails_Data.id,
              [EXPENSES_DETAILS.COLUMNS.DOCDATE]: expencesDetails_Data.docdate,
              [EXPENSES_DETAILS.COLUMNS.ACC_ID]: expencesDetails_Data.accid,
              [EXPENSES_DETAILS.COLUMNS.SUB_ACC_ID]: expencesDetails_Data.sub_acc_id,
              [EXPENSES_DETAILS.COLUMNS.AMOUNT]: expencesDetails_Data.amount,
              [EXPENSES_DETAILS.COLUMNS.CREATED_BY]: 2,
            });

        }

        const existingdata = await knex(EXPENSES.NAME)
          .select(
            EXPENSES.COLUMNS.DOCDATE,
            EXPENSES.COLUMNS.ACC_ID,
            knex.raw('SUM(' + EXPENSES.COLUMNS.AMOUNT + ') as totalAmount')
          )
          .where({
            [EXPENSES.COLUMNS.DOCDATE]: expencesMaster_Data.docdate,
            [EXPENSES.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
            [EXPENSES.COLUMNS.WAREHOUSE_ID]: expencesMaster_Data.warehouse_id,
          })
          .groupBy(
            EXPENSES.COLUMNS.DOCDATE,
            EXPENSES.COLUMNS.ACC_ID
          );

        const totalAmount = existingdata[0].totalamount


        const existingRecord = await knex(EXPENCE_LEDGER.NAME)
          .where({
            [EXPENCE_LEDGER.COLUMNS.EDATE]: expencesMaster_Data.docdate,
            [EXPENCE_LEDGER.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
            [EXPENCE_LEDGER.COLUMNS.WAREHOUSE_ID]: expencesMaster_Data.warehouse_id,
          })
          .first();

        if (existingRecord) {
          await knex(EXPENCE_LEDGER.NAME)
            .where({
              [EXPENCE_LEDGER.COLUMNS.EDATE]: expencesMaster_Data.docdate,
              [EXPENCE_LEDGER.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
              [EXPENCE_LEDGER.COLUMNS.WAREHOUSE_ID]: expencesMaster_Data.warehouse_id,
            })
            .update({
              [EXPENCE_LEDGER.COLUMNS.AMOUNT]: totalAmount,
              [EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: expencesMaster_Data.company_id,
              [EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2
            });
        } else {
          await knex(EXPENCE_LEDGER.NAME)
            .insert({
              [EXPENCE_LEDGER.COLUMNS.EDATE]: expencesMaster_Data.docdate,
              [EXPENCE_LEDGER.COLUMNS.ACC_ID]: expencesMaster_Data.accid,
              [EXPENCE_LEDGER.COLUMNS.AMOUNT]: expencesMaster_Data.amount,
              [EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: expencesMaster_Data.company_id,
              [EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2,
              [EXPENCE_LEDGER.COLUMNS.WAREHOUSE_ID]: expencesMaster_Data.warehouse_id,
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

  async function deleteExpencesWithExpencesDetails({ params, body, logTrace, userDetails }) {
    const knex = this;

    const expences_id = body.expences_id
    const warehouse_id = body.warehouse_id
    const acc_id = body.acc_id
    const edate = body.edate
    const total_amount = body.total_amount


    if (expences_id) {

      const delete_expences = await knex(EXPENSES.NAME)
        .where(EXPENSES.COLUMNS.ID, expences_id)
        .where(EXPENSES.COLUMNS.WAREHOUSE_ID, warehouse_id)
        .delete();

      const delete_expences_details = await knex(EXPENSES_DETAILS.NAME)
        .where(EXPENSES_DETAILS.COLUMNS.EXPENCES_ID, expences_id)
        .delete();

      const update_expences_ledger = await knex(EXPENCE_LEDGER.NAME)
        .where({
          [EXPENCE_LEDGER.COLUMNS.ACC_ID]: acc_id,
          [EXPENCE_LEDGER.COLUMNS.WAREHOUSE_ID]: warehouse_id,
          [EXPENCE_LEDGER.COLUMNS.EDATE]: edate
        })
        .update({
          [EXPENCE_LEDGER.COLUMNS.AMOUNT]: knex.raw(
            `${EXPENCE_LEDGER.COLUMNS.AMOUNT} - ${total_amount}`
          ),
        });

    }

    return { success: true };

  }

  async function postExpences({ params, body, logTrace, userDetails }) {
    const knex = this;

    const warehouse_limitation = await knex(WAREHOUSE.NAME)
      .select(
        WAREHOUSE.COLUMNS.LIMITATION,
      )


    const limitation = warehouse_limitation[0].limitation

    let limit = parseInt(limitation.replace('.00', ''), 10);


    const date = body.docdate;
    const expenses_amount = await knex.raw(`select sum(amount) from expenses where 
    EXTRACT(month FROM docdate) = EXTRACT(month FROM Date('${date}'))
    `)

    const amount_of_month = expenses_amount.rows[0].sum;


    if (amount_of_month < limit) {

      const query_insert = knex(EXPENSES.NAME)
        .returning("id")
        .insert({
          [EXPENSES.COLUMNS.DOCDATE]: body.docdate,
          [EXPENSES.COLUMNS.ACC_ID]: body.accid,
          [EXPENSES.COLUMNS.AMOUNT]: body.amount,
          [EXPENSES.COLUMNS.REMARKS]: body.remarks,
          [EXPENSES.COLUMNS.COMPANY_ID]: body.company_id,
          [EXPENSES.COLUMNS.CREATED_BY]: 2
        });

      const response = await query_insert;
      const id = response[0].id;
      const docno = "EX" + id;

      // Update OUTLET_EXPENSES with the generated DOCNO
      await knex(EXPENSES.NAME)
        .where(EXPENSES.COLUMNS.ID, id)
        .update({
          [EXPENSES.COLUMNS.DOCNO]: docno
        });

      const existingdata = await knex(EXPENSES.NAME)
        .select(
          EXPENSES.COLUMNS.DOCDATE,
          EXPENSES.COLUMNS.ACC_ID,
          knex.raw('SUM(' + EXPENSES.COLUMNS.AMOUNT + ') as totalAmount')
        )
        .where({
          [EXPENSES.COLUMNS.DOCDATE]: body.docdate,
          [EXPENSES.COLUMNS.ACC_ID]: body.accid,
        })
        .groupBy(
          EXPENSES.COLUMNS.DOCDATE,
          EXPENSES.COLUMNS.ACC_ID
        );

      const totalAmount = existingdata[0].totalamount


      const existingRecord = await knex(EXPENCE_LEDGER.NAME)
        .where({
          [EXPENCE_LEDGER.COLUMNS.EDATE]: body.docdate,
          [EXPENCE_LEDGER.COLUMNS.ACC_ID]: body.accid,
        })
        .first();

      if (existingRecord) {
        await knex(EXPENCE_LEDGER.NAME)
          .where({
            [EXPENCE_LEDGER.COLUMNS.EDATE]: body.docdate,
            [EXPENCE_LEDGER.COLUMNS.ACC_ID]: body.accid,
          })
          .update({
            [EXPENCE_LEDGER.COLUMNS.AMOUNT]: totalAmount,
            [EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
            [EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2,
          });
      } else {
        await knex(EXPENCE_LEDGER.NAME)
          .insert({
            [EXPENCE_LEDGER.COLUMNS.EDATE]: body.docdate,
            [EXPENCE_LEDGER.COLUMNS.ACC_ID]: body.accid,
            [EXPENCE_LEDGER.COLUMNS.AMOUNT]: body.amount,
            [EXPENCE_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
            [EXPENCE_LEDGER.COLUMNS.CREATED_BY]: 2,
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


  // async function getExpenseDocno({ logTrace }) {
  //   const knex = this;

  //   const query = knex(EXPENSES.NAME).returning("id")
  //     .orderBy(EXPENSES.COLUMNS.ID, 'desc')
  //     .limit(1);

  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get  Expense Docno",
  //     logTrace
  //   });

  //   const response = await query;

  //   if (response.length === 0) {
  //     return { Docno: "1" };
  //   }

  //   const docno = response[0].docno;
  //   const numericPart = parseInt(docno.replace(/\D/g, ''), 10);

  //   if (isNaN(numericPart)) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Invalid docno format in response",
  //       property: "",
  //       code: "INVALID_DOCNO_FORMAT"
  //     });
  //   }

  //   const Docno = `EX${numericPart + 1}`;

  //   return { Docno };
  // }

  async function getExpenseDocno({ params,
    body,
    logTrace,
    userDetails,
    financialYear }) {
    const knex = this;
    let query;
    let outlet_short_name = 'WH';
    if (params.warehouse_id) {

      const short_name = await knex(WAREHOUSE.NAME)
        .where(WAREHOUSE.COLUMNS.ID, params.warehouse_id)
        .select(WAREHOUSE.COLUMNS.SHORT_NAME);

      outlet_short_name = short_name[0].short_name

      query = knex(EXPENSES.NAME)
        .count('id as count')
        .where(EXPENSES.COLUMNS.WAREHOUSE_ID, params.warehouse_id);

    } else {

      query = knex(EXPENSES.NAME)
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

      let doc_first = `${outlet_short_name}_${financialYear}_WEX_1`
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

    const Docno = `${outlet_short_name}_${financialYear}_WEX_${numericPart + 1}`;

    return { Docno };
  }

  async function getAllExpences({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${EXPENSES.NAME}.*`,
        `${EXPENSES.NAME}.${EXPENSES.COLUMNS.DOCDATE}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.COMPANY_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,
      ])
      .from(EXPENSES.NAME)
      .leftJoin(HEADS.NAME, `${EXPENSES.NAME}.${EXPENSES.COLUMNS.ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${EXPENSES.NAME}.${EXPENSES.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)

      .whereBetween(`${EXPENSES.NAME}.${EXPENSES.COLUMNS.DOCDATE}`, [params.from_date, params.to_date]);


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Expences",
      logTrace
    });
    const response = await query;

    return response

  }

  async function updateExpences({ id, params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(EXPENSES.NAME).where(EXPENSES.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "expencesid not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const warehouse_limitation = await knex(WAREHOUSE.NAME)
      .select(
        WAREHOUSE.COLUMNS.LIMITATION,
      )

    console.log(warehouse_limitation, "warehouse_limitation");

    const limitation = warehouse_limitation[0].limitation

    let limit = parseInt(limitation.replace('.00', ''), 10);

    console.log(limit, "limitation");

    const date = body.docdate;
    const expenses_amount = await knex.raw(`select sum(amount) from expenses where 
  EXTRACT(month FROM docdate) = EXTRACT(month FROM Date('${date}'))
  `)

    const amount_of_month = expenses_amount.rows[0].sum;

    console.log(amount_of_month, "amount_of_month");

    if (amount_of_month < limit) {


      const query_update = await knex(`${EXPENSES.NAME}`)
        .where(`${EXPENSES.COLUMNS.ID}`, id)
        .update({
          [EXPENSES.COLUMNS.DOCDATE]: body.docdate,
          [EXPENSES.COLUMNS.ACC_ID]: body.accid,
          [EXPENSES.COLUMNS.AMOUNT]: body.amount,
          [EXPENSES.COLUMNS.REMARKS]: body.remarks,
          [EXPENSES.COLUMNS.COMPANY_ID]: body.company_id,
          [EXPENSES.COLUMNS.UPDATED_BY]: userDetails.id

        });

      const response = await query_update;
      if (!response) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while updating ACCOUNTMASTER",
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

  async function getAllExpencesExpencesDetails({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${EXPENSES.NAME}.*`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.COMPANY_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,

      ])
      .from(`${EXPENSES.NAME} as ${EXPENSES.NAME}`)
      .leftJoin(HEADS.NAME, `${EXPENSES.NAME}.${EXPENSES.COLUMNS.ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      // .leftJoin(SUB_ACCOUNT_MASTER.NAME, `${EXPENSES_DETAILS.NAME}.${EXPENSES_DETAILS.COLUMNS.ACC_ID}`,

      //   `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.ACC_ID}`)

      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${EXPENSES.NAME}.${EXPENSES.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${EXPENSES.NAME}.${EXPENSES.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${EXPENSES.NAME}.${EXPENSES.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      );

    // Conditionally add filters based on provided parameters
    // if (body.customer && body.customer !== 0) {
    //   query.where(
    //     `${EXPENSES.NAME}.${EXPENSES.COLUMNS.PARTYCODE}`,
    //     body.customer
    //   );
    // }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Expences",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Expences Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const expences_details = await Promise.all(
      response.map(async expences => {
        const expences_lines = await knex
          .select([
            `${EXPENSES_DETAILS.NAME}.*`,
            `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.SUB_ACC_NAME}`,
            // `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.PRODUCT_CODE}`,
            // `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            // `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            // `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${EXPENSES_DETAILS.NAME} as ${EXPENSES_DETAILS.NAME}`)
          .leftJoin(
            `${SUB_ACCOUNT_MASTER.NAME} as ${SUB_ACCOUNT_MASTER.NAME}`,
            `${EXPENSES_DETAILS.NAME}.${EXPENSES_DETAILS.COLUMNS.SUB_ACC_ID}`,
            `${SUB_ACCOUNT_MASTER.NAME}.${SUB_ACCOUNT_MASTER.COLUMNS.ID}`
          )

          .where(
            `${EXPENSES_DETAILS.NAME}.${EXPENSES_DETAILS.COLUMNS.EXPENCES_ID}`,
            expences.id
          );

        return { ...expences, expences_lines };
      })
    );

    return expences_details;
  }

  return {
    postExpencesWithExpencesDetails,
    postExpences,
    getExpenseDocno,
    getAllExpences,
    updateExpences,
    getAllExpencesExpencesDetails,
    deleteExpencesWithExpencesDetails
  };
}

module.exports = expenceRepo;



