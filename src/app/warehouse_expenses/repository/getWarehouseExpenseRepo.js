const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { WAREHOUSE_EXPENSE_MASTER,
  WAREHOUSE_EXPENSE_DETAILS,
  WAREHOUSE_EXPENSE_LEDGER } = require("../commons/constants");
const { ACCOUNTMASTER, SUB_ACCOUNTMASTER } = require("../../catalog/subaccountmaster/commons/constants");
const { WAREHOUSE } = require("../../catalog/warehouse/commons/constants");



function getWarehouseExpenseRepo(fastify) {

  async function postWarehouseExpenseRepo({ params, body, logTrace, userDetails }) {
    const knex = this;

    const trx = await knex.transaction();

    try {
      for (let i = 0; i < body.length; i++) {
        const master = body[i];

        const lastDocno = await trx(WAREHOUSE_EXPENSE_MASTER.NAME)
          .select(WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_NO)
          .where(WAREHOUSE_EXPENSE_MASTER.COLUMNS.WAREHOUSE_ID, master.warehouse_id)
          .orderBy(WAREHOUSE_EXPENSE_MASTER.COLUMNS.ID, "desc")
          .first();

        const nextDocNo = Number(lastDocno?.doc_no || 0) + 1;

        const [response] = await trx(WAREHOUSE_EXPENSE_MASTER.NAME)
          .returning("id")
          .insert({
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_DATE]: master.doc_date,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_NO]: nextDocNo,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.ACCOUNT_ID]: master.account_id,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.AMOUNT]: master.amount,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.REMARKS]: master.remarks,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.WAREHOUSE_ID]: master.warehouse_id,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.COMPANY_ID]: master.company_id,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.CREATED_BY]: userDetails?.id
          });

        const warehouseMasterId = response.id;

        // ================= DETAILS INSERT =================

        for (let j = 0; j < master.warehouse_expenses_details.length; j++) {

          const detail = master.warehouse_expenses_details[j];

          await trx(WAREHOUSE_EXPENSE_DETAILS.NAME).insert({
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.EXPENSES_MST_ID]: warehouseMasterId,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.WAREHOUSE_ID]: master.warehouse_id,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.DOC_NO]: nextDocNo,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.DOC_DATE]: detail.doc_date,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.ACCOUNT_ID]: detail.account_id,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.SUB_ACCOUNT_ID]: detail.sub_account_id,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.AMOUNT]: detail.amount,
            [WAREHOUSE_EXPENSE_DETAILS.COLUMNS.CREATED_BY]: userDetails?.id
          });

        }

        // ================= TOTAL CALCULATION =================

        const existingdata = await trx(WAREHOUSE_EXPENSE_MASTER.NAME)
          .select(
            WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_DATE,
            WAREHOUSE_EXPENSE_MASTER.COLUMNS.ACCOUNT_ID,
            trx.raw(`SUM(${WAREHOUSE_EXPENSE_MASTER.COLUMNS.AMOUNT}) as "totalAmount"`)
          )
          .where({
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_DATE]: master.doc_date,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.ACCOUNT_ID]: master.account_id,
            [WAREHOUSE_EXPENSE_MASTER.COLUMNS.WAREHOUSE_ID]: master.warehouse_id,
          })
          .groupBy(
            WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_DATE,
            WAREHOUSE_EXPENSE_MASTER.COLUMNS.ACCOUNT_ID
          );

        const totalAmount = existingdata.length
          ? Number(existingdata[0].totalAmount)
          : 0;

        // ================= LEDGER UPSERT =================

        const existingRecord = await trx(WAREHOUSE_EXPENSE_LEDGER.NAME)
          .where({
            [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.DOC_DATE]: master.doc_date,
            [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.ACCOUNT_ID]: master.account_id,
            [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.WAREHOUSE_ID]: master.warehouse_id,
          })
          .first();

        if (existingRecord) {

          await trx(WAREHOUSE_EXPENSE_LEDGER.NAME)
            .where({
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.DOC_DATE]: master.doc_date,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.ACCOUNT_ID]: master.account_id,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.WAREHOUSE_ID]: master.warehouse_id,
            })
            .update({
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.AMOUNT]: totalAmount
            });

        } else {

          await trx(WAREHOUSE_EXPENSE_LEDGER.NAME)
            .insert({
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.DOC_DATE]: master.doc_date,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.ACCOUNT_ID]: master.account_id,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.AMOUNT]: totalAmount,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.COMPANY_ID]: master.company_id,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.CREATED_BY]: userDetails?.id,
              [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.WAREHOUSE_ID]: master.warehouse_id,
            });

        }

      }

      await trx.commit();

      return { success: true };

    } catch (error) {

      await trx.rollback();

      throw error;
    }
  }

  async function deleteWarehouseExpenseRepo({ params, body, logTrace, userDetails }) {
    const knex = this;

    const { expense_mst_id } = params;

    const trx = await knex.transaction();

    try {

      const master = await trx(WAREHOUSE_EXPENSE_MASTER.NAME)
        .where({
          [WAREHOUSE_EXPENSE_MASTER.COLUMNS.ID]: expense_mst_id,
        })
        .first();

      if (!master) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Warehouse Expense ${expense_mst_id} not found`,
          code: "NOT_FOUND"
        });
      }

      const warehouseExpensesTotalAmt = master?.amount
      const warehouseExpensesAccountId = master?.account_id
      const warehouseExpensesDocdate = master?.doc_date
      const warehouseId = master?.warehouse_id

      // ================= DELETE MASTER =================

      await trx(WAREHOUSE_EXPENSE_MASTER.NAME)
        .where(WAREHOUSE_EXPENSE_MASTER.COLUMNS.ID, expense_mst_id)
        .delete();

      // ================= DELETE DETAILS =================

      await trx(WAREHOUSE_EXPENSE_DETAILS.NAME)
        .where(WAREHOUSE_EXPENSE_DETAILS.COLUMNS.EXPENSES_MST_ID, expense_mst_id)
        .delete();

      // ================= CHECK LEDGER =================

      const ledger = await trx(WAREHOUSE_EXPENSE_LEDGER.NAME)
        .where({
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.ACCOUNT_ID]: warehouseExpensesAccountId,
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.WAREHOUSE_ID]: warehouseId,
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.DOC_DATE]: warehouseExpensesDocdate
        })
        .first();

      if (!ledger) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Warehouse expense ledger not found",
          code: "NOT_FOUND"
        });
      }

      // ================= AMOUNT VALIDATION =================

      if (Number(ledger.amount) < Number(warehouseExpensesTotalAmt)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Invalid delete amount. Ledger balance is less.",
          code: "INVALID_AMOUNT"
        });
      }

      // ================= UPDATE LEDGER =================

      await trx(WAREHOUSE_EXPENSE_LEDGER.NAME)
        .where({
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.ACCOUNT_ID]: warehouseExpensesAccountId,
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.WAREHOUSE_ID]: warehouseId,
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.DOC_DATE]: warehouseExpensesDocdate
        })
        .update({
          [WAREHOUSE_EXPENSE_LEDGER.COLUMNS.AMOUNT]: trx.raw(
            `"${WAREHOUSE_EXPENSE_LEDGER.COLUMNS.AMOUNT}" - ?`,
            [warehouseExpensesTotalAmt]
          )
        });

      // ================= COMMIT =================

      await trx.commit();

      return {
        success: true,
        message: "Warehouse expense deleted successfully"
      };

    } catch (error) {

      // ================= ROLLBACK =================
      await trx.rollback();

      throw error;
    }
  }

  async function getWarehouseExpenseDocnoRepo({ params, logTrace }) {
    const knex = this;

    const { warehouse_id } = params

    const lastDocno = await knex(WAREHOUSE_EXPENSE_MASTER.NAME)
      .select(WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_NO)
      .where(WAREHOUSE_EXPENSE_MASTER.COLUMNS.WAREHOUSE_ID, warehouse_id)
      .orderBy(WAREHOUSE_EXPENSE_MASTER.COLUMNS.ID, "desc")
      .first();

    const doc_no = Number(lastDocno?.doc_no || 0) + 1;

    return { doc_no };
  }

  async function postExpense({ params, body, logTrace, userDetails }) {
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

  async function getAllExpense({ body, params, logTrace }) {
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
      context: "Get Expense",
      logTrace
    });
    const response = await query;

    return response

  }

  async function updateExpense({ id, params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(EXPENSES.NAME).where(EXPENSES.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Expenseid not found to update",
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

  async function getWarehouseExpenseDatewiseRepo({ body, params, logTrace }) {
    const knex = this;
    const { from_date, to_date, page_size, current_page } = params;
    const query = knex
      .select([
        `${WAREHOUSE_EXPENSE_MASTER.NAME}.*`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`
      ])
      .from(`${WAREHOUSE_EXPENSE_MASTER.NAME} as ${WAREHOUSE_EXPENSE_MASTER.NAME}`)
      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${WAREHOUSE_EXPENSE_MASTER.NAME}.${WAREHOUSE_EXPENSE_MASTER.COLUMNS.ACCOUNT_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)
      .leftJoin(
        WAREHOUSE.NAME,
        `${WAREHOUSE_EXPENSE_MASTER.NAME}.${WAREHOUSE_EXPENSE_MASTER.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`)
      .whereRaw(
        `DATE(${WAREHOUSE_EXPENSE_MASTER.NAME}.${WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_DATE}) >= ?`,
        [from_date]
      )
      .whereRaw(
        `DATE(${WAREHOUSE_EXPENSE_MASTER.NAME}.${WAREHOUSE_EXPENSE_MASTER.COLUMNS.DOC_DATE}) <= ?`,
        [to_date]
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get warehouse expense master",
      logTrace
    });

    const response = await query.paginate({
      pageSize: Number(page_size),
      currentPage: Number(current_page)
    });
    console.log(response, "response");

    if (!response.data || !response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "warehouse expense Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const expenseData = await Promise.all(
      response.data.map(async expense => {
        const warehouse_expenses_details = await knex
          .select([
            `${WAREHOUSE_EXPENSE_DETAILS.NAME}.*`,
            `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`,
            `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.SUB_ACCOUNT_NAME} as sub_account_name`

          ])
          .from(`${WAREHOUSE_EXPENSE_DETAILS.NAME} as ${WAREHOUSE_EXPENSE_DETAILS.NAME}`)
          .leftJoin(
            ACCOUNTMASTER.NAME,
            `${WAREHOUSE_EXPENSE_DETAILS.NAME}.${WAREHOUSE_EXPENSE_DETAILS.COLUMNS.ACCOUNT_ID}`,
            `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`)
          .leftJoin(
            SUB_ACCOUNTMASTER.NAME,
            `${WAREHOUSE_EXPENSE_DETAILS.NAME}.${WAREHOUSE_EXPENSE_DETAILS.COLUMNS.SUB_ACCOUNT_ID}`,
            `${SUB_ACCOUNTMASTER.NAME}.${SUB_ACCOUNTMASTER.COLUMNS.ID}`)
          .where(
            `${WAREHOUSE_EXPENSE_DETAILS.NAME}.${WAREHOUSE_EXPENSE_DETAILS.COLUMNS.EXPENSES_MST_ID}`,
            expense.id
          );

        return { ...expense, warehouse_expenses_details };
      })
    );
    return {
      data: expenseData,
      pagination: response.meta.pagination
    };
  }

  return {
    postWarehouseExpenseRepo,
    deleteWarehouseExpenseRepo,
    getWarehouseExpenseDocnoRepo,
    getWarehouseExpenseDatewiseRepo,
    postExpense,
    getAllExpense,
    updateExpense
  };
}

module.exports = getWarehouseExpenseRepo;



